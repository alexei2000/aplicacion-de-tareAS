import React from 'react';


class CardTask extends React.Component{
    constructor(props){
        super(props);
        this.deleteTask = this.deleteTask.bind(this);
        this.handleEditTask=this.handleEditTask.bind(this);
        this.editTask=this.editTask.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.state={
            title: '',
            description: '',
            edit : false
        }
    }

    handleChange(e){
        const {name,value}=e.target;
        this.setState({[name]:value});
    }

    handleEditTask(){
        this.setState({edit: !this.state.edit, title: this.props.title,description: this.props.description});
    }

    editTask(id){
        fetch('/api/tasks/'+id,{
            method: 'PUT',
            body: JSON.stringify(this.state),
            headers:{
                'ACCEPT': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res=> res.json())
        .then(data =>{
            M.toast({html: 'Task Edit'});
            console.log(data);
            this.setState({edit: false,title: '',description: ''})
            this.props.fetchTask();
        })
    }
    deleteTask(id){
        fetch('/api/tasks/'+id,{
            method: 'DELETE',
            headers:{
                'ACCEPT': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res=> res.json())
        .then(data =>{
            console.log(data);
            M.toast({html: 'Task Deleted'});
            this.props.fetchTask();
        })
        .catch(err=>{console.error(err)})
            
    }
    render(){
        if(this.state.edit){
            return(
                <div className="card indigo lighten-1" >
                    <div className="card-content white-text">
                        <form>
                            <div className="row">
                                <div className="input-field cos s12">
                                    <input className="white-text active" type="text" name="title" placeholder="title" value={this.state.title} onChange={this.handleChange}></input>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field  cos s12">
                                    <textarea value={this.state.description} name="description" placeholder="description" className="materialize-textarea white-text" onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-action">
                            <button className="btn waves-effect waves-light indigo darken-4"  onClick={()=>this.editTask(this.props.taskid)}>Send
                                <i className="material-icons right">send</i>
                            </button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="card indigo lighten-1" >
                  <div className="card-content white-text">
                    <span className="card-title center-align">{this.props.title}</span>
                    <p className="center-align">{this.props.description}</p>
                  </div>
                  <div className="card-action" style={{display: "flex",justifyContent: "space-between"}}>
                      <a className=" btn-floating btn-medium waves-effect waves-light indigo darken-4" onClick={this.handleEditTask} ><i className="material-icons ">edit</i></a>
                      <a className=" btn-floating btn-medium waves-effect waves-light indigo darken-4" onClick={()=>this.deleteTask(this.props.taskid)}><i className="material-icons ">delete</i></a>
                  </div>
                </div>
          );
        }
    }

}



class App extends React.Component{

    constructor(){
        super();
        this.state={
            title: '',
            description: '',
            tasks: []
        }
        this.addTask =  this.addTask.bind(this);
        this.handleChange =  this.handleChange.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
    }
    handleChange(e){
        const {name,value}=e.target;
        this.setState({[name]:value});
    }
    addTask(e){
        fetch('/api/tasks',{
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data=>{
                console.log(data);
                M.toast({html: 'Task Saved'});
                this.setState({ title: '', description: ''});
                this.fetchTasks();
            })
            .catch(err=>console.error(err));
        e.preventDefault();
    }

    componentDidMount(){
        this.fetchTasks();
    }
    fetchTasks(){
        fetch('/api/tasks')
            .then(res=> res.json())
            .then(data =>{
                this.setState({tasks:data});
            })
            .catch(err=>{console.error(err)})
    }
    render(){
        const cards=this.state.tasks.map((task)=>
            <div className="col s12  m12  l4 " key={task._id}>
                <CardTask title={task.title} description={task.description} taskid={task._id} fetchTask={this.fetchTasks} />
            </div>
        );

        return(
            <div>
                <nav className="indigo darken-4">
                    <div className="container">
                        <a className="brand-logo" href="/"> MERN Stack</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
            	        <div className="col s12 m4 l3">
                            <div className="card">
                                <div className="card-content">
                                    <form onSubmit={this.addTask}>
                                        <div className="row">
                                            <div className="input-field cos s12">
                                                <input id="task-title" type="text" name="title" value={this.state.title} onChange={this.handleChange}></input>
                                                <label htmlFor="task-title">Task Title</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field  cos s12">
                                                <textarea id="task-description" value={this.state.description} name="description"  className="materialize-textarea" onChange={this.handleChange}></textarea>
                                                <label htmlFor="task-description">Task Description</label>
                                            </div>
                                        </div>
                                        <button className="btn waves-effect waves-light indigo darken-4"  type="submit">Send
                                            <i className="material-icons right">send</i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s12 m8 l9 ">
                            {cards}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;