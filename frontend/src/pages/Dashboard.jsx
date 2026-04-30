import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getUser } from "../api/api";
import TaskSection from "../components/TaskSection";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [allTasks, setAllTasks] = useState([]);

  // 🔹 Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch {
      alert("Unauthorized");
      navigate("/");
    }
  };

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch all tasks
  const fetchAllTasks = async () => {
    try {
      let tasks = [];

      for (let p of projects) {
        const res = await API.get(`/tasks/${p._id}`);
        tasks = [...tasks, ...res.data];
      }

      setAllTasks(tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      fetchAllTasks();
    }
  }, [projects]);

  // 📊 Stats
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === "done").length;
  const pending = total - completed;
  const overdue = allTasks.filter(
    t =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "done"
  ).length;

  // 🔹 Create project
  const createProject = async () => {
    if (!name || !desc) return alert("Fill all fields");

    try {
      await API.post("/projects", { name, description: desc });
      setName("");
      setDesc("");
      fetchProjects();
    } catch {
      alert("Error creating project");
    }
  };

  // 🔹 Add member
  const addMember = async (projectId) => {
    const userId = selectedUser[projectId];
    if (!userId) return alert("Select user");

    await API.put(`/projects/${projectId}/add-member`, { userId });
    alert("Member added");
  };

  // 🔹 Remove member
  const removeMember = async (projectId) => {
    const userId = selectedUser[projectId];
    if (!userId) return alert("Select user");

    await API.put(`/projects/${projectId}/remove-member`, { userId });
    alert("Member removed");
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Dashboard</h2>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* 📊 STATS */}
        <h3 style={styles.sectionTitle}>Dashboard Stats</h3>

        <div style={styles.stats}>
          <StatCard title="Total" value={total} />
          <StatCard title="Completed" value={completed} color="green" />
          <StatCard title="Pending" value={pending} color="orange" />
          <StatCard title="Overdue" value={overdue} color="red" />
        </div>

        {/* ➕ CREATE PROJECT */}
        {user?.role === "admin" && (
          <div style={styles.card}>
            <h3>Create Project</h3>

            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="Project Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Description"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />

              <button style={styles.primaryBtn} onClick={createProject}>
                Create
              </button>
            </div>
          </div>
        )}

        <h3 style={styles.sectionTitle}>Projects</h3>

        {projects.map(p => (
          <div key={p._id} style={styles.projectCard}>
            <h4>{p.name}</h4>
            <p>{p.description}</p>

            {/* 👥 MEMBER MANAGEMENT */}
            {user?.role === "admin" && (
              <div style={styles.memberBox}>
                <select
                  style={styles.input}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      [p._id]: e.target.value
                    })
                  }
                >
                  <option value="">Select user</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <button
                  style={styles.successBtn}
                  onClick={() => addMember(p._id)}
                >
                  Add
                </button>

                <button
                  style={styles.dangerBtn}
                  onClick={() => removeMember(p._id)}
                >
                  Remove
                </button>
              </div>
            )}

            <TaskSection projectId={p._id} />
          </div>
        ))}
      </div>
    </div>
  );
}

// 📊 CARD COMPONENT
function StatCard({ title, value, color }) {
  return (
    <div style={styles.statCard}>
      <h4>{title}</h4>
      <p style={{ color: color || "black" }}>{value}</p>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: 20
  },
  wrapper: {
    maxWidth: 900,
    margin: "auto"
  },
  title: {
    textAlign: "center"
  },
  sectionTitle: {
    textAlign: "center",
    marginBottom: 15
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30
  },
  statCard: {
    background: "#fff",
    padding: 20,
    width: "22%",
    textAlign: "center",
    borderRadius: 8,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)"
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  projectCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)"
  },
  row: {
    display: "flex",
    gap: 10
  },
  input: {
    padding: 10,
    flex: 1
  },
  primaryBtn: {
    padding: 10,
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  logoutBtn: {
    padding: "8px 15px",
    background: "#444",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  memberBox: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    justifyContent: "center"
  },
  successBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "8px 12px"
  },
  dangerBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px"
  }
};