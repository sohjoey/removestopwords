import sw from 'stopword';
import qwest from 'qwest';

self.addEventListener('message', function(event){
    if(!event || !event.data || event.data.trim().length < 1){
        return;
    }
    
    let arrSentences = event.data.split('.')
    let editedSentences = []
    let _this = {
        state: {
            data: []
        }
    }

    for(let s of arrSentences){
       let arrTxtEdited = sw.removeStopwords(s.split(' '))
       if(arrTxtEdited.length){
          let txtEdited = arrTxtEdited.join(' ')
          if(txtEdited.trim().length > 0)
             editedSentences.push({"sentence": txtEdited})
       }
    }

    if(editedSentences.length){
        qwest.post('create', {arrSentence : editedSentences}).then(
           function(xhr,result){
              for(let s of result.ops){
                 _this.state.data.push({
                    "id" : s._id,
                    "value" : s.sentence
                 })
              }
              self.postMessage(_this.state.data)
           })
     }
})
