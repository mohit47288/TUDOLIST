import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const [todoLists, setTodoLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [taskInputs, setTaskInputs] = useState({});
  const [editTaskInputs, setEditTaskInputs] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // Fetch To-Do lists
  const fetchTodoLists = async (user) => {
    if (user) {
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${user.uid}/todoLists`)
        );
        const fetchedLists = await Promise.all(
          querySnapshot.docs.map(async (listDoc) => {
            const tasksSnapshot = await getDocs(
              collection(db, `users/${user.uid}/todoLists/${listDoc.id}/tasks`)
            );
            const tasks = tasksSnapshot.docs.map((taskDoc) => ({
              id: taskDoc.id,
              ...taskDoc.data(),
            }));
            return {
              id: listDoc.id,
              ...listDoc.data(),
              tasks,
            };
          })
        );
        setTodoLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching To-Do Lists: ", error);
      }
    }
  };

  // Add a new To-Do List
  const addTodoList = async () => {
    const user = getAuth().currentUser;
    if (newListName.trim() && user) {
      try {
        await addDoc(collection(db, `users/${user.uid}/todoLists`), {
          name: newListName,
          createdBy: user.email,
          createdAt: new Date(),
        });
        fetchTodoLists(user);
        setNewListName("");
      } catch (error) {
        console.error("Error adding To-Do List: ", error);
      }
    }
  };

  // Handle input change for tasks
  const handleTaskInputChange = (listId, field, value) => {
    setTaskInputs((prev) => ({
      ...prev,
      [listId]: { ...prev[listId], [field]: value },
    }));
  };

  // Add a new task
  const addTask = async (listId) => {
    const user = getAuth().currentUser;
    const newTask = taskInputs[listId];
    if (newTask?.title.trim() && user) {
      try {
        await addDoc(
          collection(db, `users/${user.uid}/todoLists/${listId}/tasks`),
          {
            ...newTask,
            priority: newTask.priority || "low",
            createdAt: new Date(),
          }
        );
        fetchTodoLists(user);
        setTaskInputs((prev) => ({
          ...prev,
          [listId]: {
            title: "",
            description: "",
            dueDate: "",
            priority: "low",
          },
        }));
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    }
  };

  // Set task to be edited
  const startEditingTask = (listId, task) => {
    setEditingTaskId(task.id);
    setEditTaskInputs({
      ...editTaskInputs,
      [listId]: { title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority },
    });
  };

  // Handle input change for edited tasks
  const handleEditTaskInputChange = (listId, field, value) => {
    setEditTaskInputs((prev) => ({
      ...prev,
      [listId]: { ...prev[listId], [field]: value },
    }));
  };

  // Save the edited task
  const saveEditedTask = async (listId, taskId) => {
    const user = getAuth().currentUser;
    const editedTask = editTaskInputs[listId];
    if (editedTask?.title.trim() && user) {
      try {
        const taskRef = doc(db, `users/${user.uid}/todoLists/${listId}/tasks`, taskId);
        await updateDoc(taskRef, { ...editedTask });
        fetchTodoLists(user);
        setEditingTaskId(null); // Reset the editing task
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    }
  };

  // Delete a task
  const deleteTask = async (listId, taskId) => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/todoLists/${listId}/tasks`, taskId));
        fetchTodoLists(user);
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    }
  };

  // Delete a to-do list
  const deleteTodoList = async (listId) => {
    const user = getAuth().currentUser;
    if (user) {
      try {
        // Delete all tasks in the list
        const tasksSnapshot = await getDocs(
          collection(db, `users/${user.uid}/todoLists/${listId}/tasks`)
        );
        const deleteTasksPromises = tasksSnapshot.docs.map((taskDoc) =>
          deleteDoc(doc(db, `users/${user.uid}/todoLists/${listId}/tasks`, taskDoc.id))
        );
        await Promise.all(deleteTasksPromises);

        // Delete the list itself
        await deleteDoc(doc(db, `users/${user.uid}/todoLists`, listId));
        fetchTodoLists(user);
      } catch (error) {
        console.error("Error deleting to-do list: ", error);
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTodoLists(user);
      } else {
        setTodoLists([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">To-Do List</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-4 flex justify-between">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="input-field flex-1 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Create new To-Do List"
          />
          <button
            onClick={addTodoList}
            className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 transition"
          >
            Add List
          </button>
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          {todoLists.map((list) => (
            <div key={list.id} className="p-6 bg-gray-100 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-700">{list.name}</h3>
                <button
                  onClick={() => deleteTodoList(list.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete List
                </button>
              </div>

              {list.tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 mt-2 rounded-md shadow-md">
                  {editingTaskId === task.id ? (
                    <div>
                      <input
                        type="text"
                        value={editTaskInputs[list.id]?.title || ""}
                        onChange={(e) =>
                          handleEditTaskInputChange(list.id, "title", e.target.value)
                        }
                        className="input-field mb-2 w-full p-2 border rounded-md"
                        placeholder="Task Title"
                      />
                      <input
                        type="text"
                        value={editTaskInputs[list.id]?.description || ""}
                        onChange={(e) =>
                          handleEditTaskInputChange(list.id, "description", e.target.value)
                        }
                        className="input-field mb-2 w-full p-2 border rounded-md"
                        placeholder="Task Description"
                      />
                      <input
                        type="date"
                        value={editTaskInputs[list.id]?.dueDate || ""}
                        onChange={(e) =>
                          handleEditTaskInputChange(list.id, "dueDate", e.target.value)
                        }
                        className="input-field mb-2 w-full p-2 border rounded-md"
                      />
                      <select
                        value={editTaskInputs[list.id]?.priority || ""}
                        onChange={(e) =>
                          handleEditTaskInputChange(list.id, "priority", e.target.value)
                        }
                        className="input-field mb-2 w-full p-2 border rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => saveEditedTask(list.id, task.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                        <p className="text-gray-600">{task.description}</p>
                        <p className="text-gray-600">Due: {task.dueDate}</p>
                        <p className="text-gray-600">Priority: {task.priority}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => startEditingTask(list.id, task)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(list.id, task.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-4">
                <input
                  type="text"
                  value={taskInputs[list.id]?.title || ""}
                  onChange={(e) =>
                    handleTaskInputChange(list.id, "title", e.target.value)
                  }
                  className="input-field mb-2 w-full p-2 border rounded-md"
                  placeholder="Task Title"
                />
                <input
                  type="text"
                  value={taskInputs[list.id]?.description || ""}
                  onChange={(e) =>
                    handleTaskInputChange(list.id, "description", e.target.value)
                  }
                  className="input-field mb-2 w-full p-2 border rounded-md"
                  placeholder="Task Description"
                />
                <input
                  type="date"
                  value={taskInputs[list.id]?.dueDate || ""}
                  onChange={(e) =>
                    handleTaskInputChange(list.id, "dueDate", e.target.value)
                  }
                  className="input-field mb-2 w-full p-2 border rounded-md"
                />
                <select
                  value={taskInputs[list.id]?.priority || "low"}
                  onChange={(e) =>
                    handleTaskInputChange(list.id, "priority", e.target.value)
                  }
                  className="input-field mb-2 w-full p-2 border rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => addTask(list.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
