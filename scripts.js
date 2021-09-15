const Modal = {
    open(){
        //Abrir modal
        //Adicionar classe active ao modal
        document
                .querySelector('.modal-overlay')
                .classList
                .add('active')
    
    },



    close(){
        //Fechar modal
        //remover classe active do modal
        document
                .querySelector('.modal-overlay')
                .classList
                .remove('active')
    
    
    },


} 

const Storage = {
    get() {
       return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] 
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify (transactions))
    },
}

const Transaction = {
    all: Storage.get(),
    
    add(transaction){
        //a funcionalidade push está atrelada a listas, ou seja, arrays.
        //e o push vai colocar a transaction dentro do array.
        Transaction.all.push(transaction)
        
        App.reload()
    },
    
    remove (index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
       // somar as entradas
        let income = 0;
       //para cada transação
        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })
        return income;
    },
     expenses () {
        let expense = 0;
        //para cada transação
         Transaction.all.forEach(transaction => {
            //se ela for menor que zero 
            if( transaction.amount < 0 ) {
                 expense += transaction.amount;
             }
         })
         return expense;
    },

    total() {
        //subtrair as entradas e saídas.
        return Transaction.incomes() + Transaction.expenses();
    
    },  
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        
        DOM.transactionsContainer.appendChild(tr)   
    
    },
     //html interno de uma transação.
    innerHTMLTransaction(transaction, index) {
       const CSSclass = transaction.amount > 0 ? "income" : "expense" 
        
        const amount = Utils.formatCurrency(transaction.amount)

       const html = `
        
        <td class="description">${transaction.description}</td>
        <td class= "${CSSclass}">${amount}</td>
        <td class="data">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
                `
        return html
    },

    updateBalance() {
        document
            .getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    formatDate(date) {
        //separacao e formatacao da data
        const splittedDate = date.split("-")
        return `${splittedDate [2]}/${splittedDate [1]}/${splittedDate [0]}`    
    },
    
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        //formatando a moeda para Real.
        //a barra no sentido oposto significa "ache tudo que não for número" e o 'g' faz uma pesquisa global.
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        //essa funcionalidade mostra o local que está.
        value = value.toLocaleString("pt-BR",{
            style:"currency", //significa a moeda brasileira
            currency:"BRL"
        })
        

        return signal + value
        
    }
}

const Form = { 
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
        
    },
    
    
    
    //validar os campos
    //formatar os dados

    validateFields () {
        const{ description, amount, date} = Form.getValues()

        if( description.trim() ==="" ||
            amount.trim() === "" ||
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
            } 
    },
    
    formatValues() {
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }

    },
    
   
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    
    submit(event) {
        event.preventDefault()
        
        try{
        //verificar se todas as informações foram preenchidas   
        Form.validateFields()
        //formatar os dados para salvar
        const transaction = Form.formatValues()
        Transaction.add(transaction)
        //salvar
        //apagar os dados do formulário
        Form.clearFields()
        //e depois quero que o modal feche.
        Modal.close()
        //atualizar a aplicação
        
        }

        catch(error) {
            alert(error.message)
        }
    },

    
    
}

const App = {
    init () {
       
        //colocando o sinal de igual ajusta umas coisas mas não da pra remover nada.
        Transaction.all.forEach(DOM.addTransaction)


        DOM.updateBalance()
        
        Storage.set(Transaction.all)
    },
    
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()


