import { useEffect, useState } from "react";
import API, { getUser } from "../api/api";
import TaskCard from "./TaskCard";

export default function TaskSection({ projectId }) {
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
  };

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${projectId}`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [projectId]);

  const createTask = async () => {
    if (!title) return;

    await API.post("/tasks", {
      title,
      projectId,
      assignedTo,
      dueDate,
      priority
    });

    setTitle("");
    setDueDate("");
    setAssignedTo("");
    setPriority("medium");
    fetchTasks();
  };

  const updateStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  return (
    <div style={{ marginTop: 10 }}>
      {/* ADMIN ONLY */}
      {user?.role === "admin" && (
        <>
          <input
            placeholder="Task Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />

          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
            <option value="">Assign User</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <button onClick={createTask}>Add Task</button>
        </>
      )}

      {/* TASK LIST */}
      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
        {["todo", "in-progress", "done"].map(status => (
          <div key={status} style={{ flex: 1, border: "1px solid #ccc", padding: 10 }}>
            <h4>{status.toUpperCase()}</h4>

            {tasks
              .filter(t => t.status === status)
              .map(t => (
                <TaskCard
                  key={t._id}
                  task={t}
                  updateStatus={updateStatus}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}