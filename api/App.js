import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react';

function App() {

  const [fotos, setFotos] = useState([]);
  const URL = "http://localhost:8080/"

  function handleUploadFile(event){
    const data = new FormData();

    data.append('file', event.target.files[0]);
    data.append('name', 'some value user types');
    data.append('description', 'some value user types');
    
    axios.post('http://localhost:8080/foto', data ).then((response) => {
      console.log("upload de foto realizado");
    }).then(()=>{
      axios.get('http://localhost:8080/baixar-fotos').then((response) => {
        setFotos(response.data);
      });
    });
  }

  useEffect(()=>{
    axios.get('http://localhost:8080/baixar-fotos').then((response) => {
      setFotos(response.data);
    });
  },[])


  
  return (
    <div className="App">
      <h1>upload de imagem</h1>
      <input type="file" onChange={handleUploadFile}/>
      {
        fotos.map((foto)=>{
          return(
            <div key={foto.id}>
              <br/>
              <img  src={URL+foto.url} alt='foto' width={600} height={400}/>
              <br/>
            </div>
          )
        })
      }
      
    </div> 
  );
}

export default App;
