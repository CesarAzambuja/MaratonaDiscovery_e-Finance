const Modal = {
    openClose(){
        document
            .querySelector('.modal-overlay')
            .classList
            .toggle('active')
    },

}

const Storage ={
    get(){
        return JSON.parse(localStorage.getItem("wayne-finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("wayne-finances:transactions", JSON.stringify(transactions));
    }
}   

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()

    },

    incomes(){
        // Pegar todas as transações
        // Verificar se a Transação é maior que zero
        // Se Maior que zero, somar a uma variavel e retornar a variavel
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0) {
                income = income + transaction.amount;
            }
        })
        
        return income;
    },

    expenses(){
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0) {
                expense = expense + transaction.amount;
            }
        })
        
        return expense
    },

    total(){
           return Transaction.incomes() + Transaction.expenses()
        }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransition(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransition(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransition(transaction, index){
        const CSSClass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remove Item">
            </td>
            `

        return html
    },

    updateBalance(){
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "" 

        value = String(value).replace(/\D/g, "")

        value = Number(value)/ 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency:"BRL"
        })


        return (signal + value)
    },

    formatAmount(value){
        value = Number(value) *100
        
        return value
    },

    formatDate(date){
        const splitedDate = date.split("-")

        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeFields(){
        const {description, amount, date} = Form.getValues()
        
        if(description.trim() === "" || 
           amount.trim() ==="" || 
           date.trim() ===""){
                throw new Error("Por favor, preencher todos os campos.")
            }

    },

    formatValues(){
     let  {description, amount, date} = Form.getValues()   

     amount = Utils.formatAmount(amount)
     date = Utils.formatDate(date)

     return {description, amount, date}
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

         try {
        Form.validadeFields() //Validar dados
        const transaction = Form.formatValues() //Formatar dados
        Transaction.add(transaction)
        Form.clearFields() // Limpar Campos
        Modal.openClose() // Fechar modal
        
    } catch (error) {
        alert(error.message)
        
    }

    }
}

const App = {
    init(){
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransition(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    

    },
    reload(){
        DOM.clearTransactions()
        App.init()

    },
}

App.init()
