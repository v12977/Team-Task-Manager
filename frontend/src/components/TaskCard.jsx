export default function TaskCard({ task, updateStatus }) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: 5,
        padding: 10,
        background: isOverdue ? "#ffcccc" : "#fff"
      }}
    >
      <b>{task.title}</b>

      <p>👤 {task.assignedTo?.name || "Unassigned"}</p>
      <p>📅 {task.dueDate ? new Date(task.dueDate).toDateString() : "No date"}</p>
      <p>⚡ {task.priority}</p>

      <button onClick={() => updateStatus(task._id, "todo")}>Todo</button>
      <button onClick={() => updateStatus(task._id, "in-progress")}>In Progress</button>
      <button onClick={() => updateStatus(task._id, "done")}>Done</button>
    </div>
  );
}