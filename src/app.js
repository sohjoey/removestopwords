import React, { Component } from 'react';
import qwest from 'qwest';
import WorkerProcessText from './processtext.worker.js';

const workerProcessText = new WorkerProcessText()

class App extends Component{
   constructor(){
      super()

      var _this = this

      this.state = {
         inputText : `test1.test2.test3`,
         arrText: [

         ],
         data : [
         ]
      }

      this.addText = this.addText.bind(this)
      this.clearText = this.clearText.bind(this)
      this.updateText = this.updateText.bind(this)
      this.deleteItem = this.deleteItem.bind(this)

      workerProcessText.addEventListener('message',function(event){
         console.log(`message: ${JSON.stringify(event.data)}`) 
         _this.setState({data: _this.state.data.concat(event.data)})
      })

      this.loadText()
   };

   updateText(e){
      this.setState({
         inputText: e.target.value
      })
   }

   clearText(e){
      this.setState({inputText: ""})
   }

   

   addText(){
      this.state.inputText = this.state.inputText.trim()
      if(this.state.inputText.length < 1){
         return;
      }
      
      let txt = this.state.inputText
      workerProcessText.postMessage(txt)
   }

   testPost(){
      qwest.post('testPost').then(function(xhr,res){
         console.log(`res: ${res}`)
      })
   }

   testdb(){
      let _this = this
      qwest.post('testDb').then(function(xhr,result){
         console.log(result)
       })
   }

   loadText(){
      let _this = this
      qwest.post('load').then(function(xhr,result){
         for(let s of result){
            _this.state.data.push({
               "id" : s._id,
               "value" : s.sentence
            })
         }
         _this.setState({data: _this.state.data})
       })
   }
   
   deleteItem(arrIndex) {    
      let _this = this
      var obj = _this.state.data[arrIndex]
      var arr1 = []
      var arr2 = []
      
      if(arrIndex === 0)
      {
         arr1 = _this.state.data.slice(1)
      }
      else
      {
         arr1 = _this.state.data.slice(0,arrIndex)
         arr2 = _this.state.data.slice(arrIndex+1)
      }
      
      _this.state.data = arr1.concat(arr2)
      _this.setState({data: _this.state.data})
      
       qwest.post('delete',{id: obj.id}).then(function(xhr,result){
         console.log(result)
      })
   }

   render(){
      return(
         <div>
            <h1>Remove stop words</h1>
            <div>
               <Header addTextProp = {this.addText}
                  updateTextProp = {this.updateText}
                  inputTextProp = {this.state.inputText}
                  clearTextProp = {this.clearText}
                  inputText = {this.state.inputText}>
               </Header>
            </div>
            <table>
               <tbody>
                  {this.state.data.map((obj,i) => 
                     <TableRow 
                        param1 = {obj}
                        arrIndex = {i}
                        key = {obj.id}
                        testFunction = {this.testFunction}
                        addText = {this.addText}
                        updateText = {this.updateText}
                        inputText = {this.state.inputText}
                        deleteItem = {this.deleteItem}
                     >
                     </TableRow>
                  )}
               </tbody>
            </table>
         </div>
      );
   }
}

class Header extends Component {
   render(){
      let textAreaStyle = {
         width: "100%"
      }

      return (
         <div>
            Input Text: {this.props.inputTextProp}
            <br/>
            <textarea style = {textAreaStyle} type = "text" value = {this.props.inputText} onChange = {this.props.updateTextProp} multiline = "true" rows = "5"/>
            <br/>
            <button onClick = {this.props.addTextProp}>add Text</button>
            <button onClick = {this.props.clearTextProp}>clear</button>
            <br/>
         </div>)
   }
}

class TableRow extends Component {
   render(){
      let tdStyle = {
         borderStyle: "solid",
         borderWidth: "1px",
         borderColor: "lightgray",
         cellPadding: '0px'
      }

      let tdStyleSentence = {
         borderStyle: "solid",
         borderWidth: "1px",
         borderColor: "lightgray",
         cellPadding: '0px',
         minWidth: '500px',
         maxWidth: '80%'
      } 

      let tdStyleID = {
         width: "0px",
         visibility: "hidden"
      }

      let iconStyle = {
         width: "10px"
      };

      let tdIconStyle = {
         borderStyle: "solid",
         borderWidth: "1px",
         borderColor: "lightgray",
         cellPadding: '0px',
         width: "12px"
      };

      return (
         <tr>
            <td style = {tdStyle}>{this.props.arrIndex + 1}</td>
            <td style = {tdStyleSentence}>{this.props.param1.value}</td>
            <td style = {tdIconStyle} onClick = {this.props.deleteItem.bind(this,this.props.arrIndex)}>
               <img src = './images/icon.png' style = {iconStyle}></img></td>
            <td style = {tdStyleID}>id: {this.props.param1.id}</td>
         </tr>
      )
   }
}

export default App;

