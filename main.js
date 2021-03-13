let btnObj = document.getElementById('createTableButton');

btnObj.onclick = (ev) => {
    ev.preventDefault();
    let totalData = document.getElementById('dataInput');

    // resultArr will be at the end an array with objects inside 
    // as items. These objects will have the keys salutation, 
    // firstName, lastName, telephone, email and valid.
    // At the end this Array with the objects will be 
    // filtered for valid objects duplicates will be deleted.
    // The filtered resultArr will be used to create the table.

    let resultArr = [];



    // splitting the whole textarea in single lines of data
    // and getting an array where every item is a complete
    // set of data (as a string) and also checking if an empty
    // line was in the textarea and deleting it:

    let totalDataArr = totalData.value.split('\n');

    totalDataArr = totalDataArr.filter(elem => elem.length>0)


    // splitting the lines of complete data into single array
    // of date and deleting items with empty strings (if user 
    // makes more than one white space)

    let totalDataAsSingleArr = [];

    for (let i = 0; i < totalDataArr.length; i++) {
        totalDataAsSingleArr.push(totalDataArr[i].split(' '));

        totalDataAsSingleArr[i]=totalDataAsSingleArr[i].filter(elem => elem !== '');
    }



    // checking if there is a salutation, if yes it will be saved in resultArr 
    // and the salutation will be deleted in the origin

    for (let i = 0; i < totalDataAsSingleArr.length; i++) {
        let compareStr = totalDataAsSingleArr[i][0].toLowerCase();
        if (compareStr === 'mr' || compareStr === 'mr.' || compareStr === 'mister') {
            resultArr[i] = {
                salutation: 'Mr',
                valid: true
            };
            totalDataAsSingleArr[i].shift();
        } else if (compareStr === 'mrs' || compareStr === 'mrs.' || compareStr === 'mistress') {
            resultArr[i] = {
                salutation: 'Mrs',
                valid: true
            };
            totalDataAsSingleArr[i].shift();
        } else if (compareStr === 'ms.' || compareStr === 'ms' || compareStr === 'miss') {
            resultArr[i] = {
                salutation: 'Ms',
                valid: true
            };
            totalDataAsSingleArr[i].shift();
        } else {
            resultArr[i] = {
                salutation: '',
                valid: true
            };
        }
    }



    // checking if the last item in the singleDataArray is an email
    // and if the email is valid.
    // if there is an email it will be saved in resultArr and the 
    // email will be deleted in the origin

    for (let i = 0; i < totalDataAsSingleArr.length; i++) {
        if (totalDataAsSingleArr[i].length > 0) {
            let compareStr = totalDataAsSingleArr[i][totalDataAsSingleArr[i].length - 1].toLowerCase();
            if (compareStr.split('@').length === 2 && compareStr.split('@')[1].split('.').length >= 2) {
                resultArr[i].email = compareStr.toLowerCase();
                totalDataAsSingleArr[i].pop();
            } else if ((compareStr.includes('@') && (compareStr.split('@').length !== 2) || (compareStr.includes('@') && compareStr.split('@')[1].split('.').length < 2))) {
                resultArr[i].email = 'incorrect email';
                totalDataAsSingleArr[i].pop();
            } else {
                resultArr[i].email = '';
            }
        }
    }



    // checking if the first item in the singleDataArray is a name 
    // by checking if it only has letters
    // the result will be saved in the resultArr, if it is not a name
    // the key valid will become false
    // the first item will be removed afterwards 

    for (let i = 0; i < totalDataAsSingleArr.length; i++) {
        if (totalDataAsSingleArr[i].length > 0) {

            if (!/[^a-zA-Z]/.test(totalDataAsSingleArr[i][0])) {
                resultArr[i].firstName = totalDataAsSingleArr[i][0];
            } else {
                resultArr[i].firstName = 'invalid first name';
                resultArr[i].valid = false;
            }
            totalDataAsSingleArr[i].shift()
        } else {
            resultArr[i].valid = false;
        }
    }


    // the same logic now for the last name

    for (let i = 0; i < totalDataAsSingleArr.length; i++) {
        if (totalDataAsSingleArr[i].length > 0) {

            // here the apostrophe is also accepted!
            if (!/[^a-zA-Z']/.test(totalDataAsSingleArr[i][0])) {
                resultArr[i].lastName = totalDataAsSingleArr[i][0];
            } else {
                resultArr[i].lastName = 'invalid last name';
                resultArr[i].valid = false;
            }
            totalDataAsSingleArr[i].shift()
        }
        else {
            resultArr[i].valid = false;
        }
    }



    // the rest must be the telephone number, which is splitted in
    // several parts, when there were white spaces. So we join the parts
    // the we check if there only numbers and some allowed sign as
    // +,-,()


    totalDataAsSingleArr.forEach ((elem, i) => {
        if (elem.length > 0) {
            let telephoneNumber = elem.join(' ');
            {!/[^0-9()\ \+\-]/.test(telephoneNumber) ? resultArr[i].telephone = telephoneNumber : resultArr[i].telephone = 'incorrect number'}
        } else {
            resultArr[i].telephone = '';
        }
    });

    
    
    // filtering only the valid objects

    resultArr = resultArr.filter(item => item.valid);



    // checking if there any duplicates by firstName and Lastname 
    // and filtering them

    uniqueResultArr = resultArr.filter((obj, index, self) =>{ 
        return index === self.findIndex((elem) => { 
            return (elem['firstName'].toLowerCase() === obj['firstName'].toLowerCase() && elem['lastName'].toLowerCase() === obj['lastName'].toLowerCase() )  
        }); 
    });


    // now creating the table by DOM-manipulation

    const tableObj = document.getElementsByClassName('general_table')[0];
    let newTable = `<thead>
    <tr>
        <td>Salutation</td><td>First name</td><td>Last name</td><td>Telephon</td><td>Email</td>
    </tr>
    </thead>
    <tbody>`;

    for (let i=0; i<uniqueResultArr.length; i++) {
        newTable += `<tr>
        <td>${uniqueResultArr[i].salutation}</td>
        <td>${uniqueResultArr[i].firstName.charAt(0).toUpperCase()+uniqueResultArr[i].firstName.slice(1)}</td>
        <td>${uniqueResultArr[i].lastName.charAt(0).toUpperCase()+uniqueResultArr[i].lastName.slice(1)}</td>
        <td>${uniqueResultArr[i].telephone}</td>
        <td>`;
        {uniqueResultArr[i].email==='incorrect email' ? email = `${uniqueResultArr[i].email}` : email = `<a href mailto="${uniqueResultArr[i].email}">${uniqueResultArr[i].email}</a>`}

        newTable+=`${email}</td></tr>` 
    }

    newTable += `</tbody>`;


    tableObj.innerHTML=newTable;

}