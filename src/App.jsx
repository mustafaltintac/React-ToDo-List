import React, { useRef,useState,useEffect } from "react";

import "./App.css";
import TaskCreate from "./components/TaskCreate";
import TaskList from "./components/TaskList";
import axios from "axios"



function App() {
  const [tasks, setTasks] = useState([]);
  const [filterTask, setFilterTask] = useState([]);
  const inputRefTask = useRef(null);
  const [flag,setFlag]=useState(false)



  const createTask = async (title, tascDesc) => {
  const response = await axios.post('http://localhost:3004/tasks',{
  title:title,
  tascDesc:tascDesc,
  isCompleted: false,
  isInput: false,
})
    if(title!==""){
      const createTasks = [...tasks, response.data];
      setTasks(createTasks);
    }
    else{
      alert("BAŞLIK GİRMEDİNİZ")
    }
  };

  const fetchTask= async ()=>{
    const response= await axios.get("http://localhost:3004/tasks")
    setTasks(response.data)
   }
 
   useEffect(()=>{
     fetchTask()
   },[])

  const filter=(text)=>{
    if(text!==""){
      const filteredTask=tasks.filter((task)=>{
        return task.title.toLowerCase().includes(text.toLowerCase())
      })
      if(filteredTask.length>0){
        setFilterTask(filteredTask)
        setFlag(true)
      }
      else{
        alert("Aradığınız Task Bulunamadı")
        setFilterTask(tasks)
      }
    }
    else{
      setFlag(false)
    }
    }

  const deleteTask = async (id) => {

  await axios.delete(`http://localhost:3004/tasks/${id}`)

    const selectedTaskId = tasks.findIndex((obj) => obj.id == id);
    tasks.splice(Number(selectedTaskId), 1);
    setTasks([...tasks])

    if(tasks.length<1){
      alert("LİSTEDİNİZDE TASK KALMADI")
    }
  };

  const completeTask = (id) => {
    const selectedTaskId = tasks.findIndex((obj) => obj.id == id);
    tasks[selectedTaskId].isCompleted = true;
    setTasks([...tasks]);
  };

  const focus = () => {
    inputRefTask.current.focus();
  };

  return (
    <div className="App">
      <TaskCreate
        createTask={createTask}
        tasks={tasks}
        inputRefTask={inputRefTask}
        focus={focus}
        filter={filter}

      />
      <h1>GÖREVLER</h1>

      <TaskList
        tasks={flag?filterTask:tasks}
        deleteTask={deleteTask}
        completeTask={completeTask}
        focus={focus}
        filterTask={filterTask}
      />
    </div>
  );
}

export default App;
