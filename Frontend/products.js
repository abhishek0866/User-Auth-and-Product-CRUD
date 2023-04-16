
function generateProductFields(event) {
    event.preventDefault(); // prevent form submission

    var no_of_products = document.getElementById('no_of_products').value;

    var product_fields_html = '';
    // Generate input fields for each product
    for (var i = 1; i <= no_of_products; i++) {
        product_fields_html += '<label for="product_' + i + '">Product ' + i + ':</label><input type="text" class="form-control" name="product_' + i + '" id="product_' + i + '" placeholder="Enter Product name"><br>';
    }

    // Add the input fields to the DOM
    document.getElementById('product_fields').innerHTML = product_fields_html;

    // Hide the "How Many" input and label
    document.getElementById('no_of_products').style.display = 'none';
}

const apiUrl = "http://localhost:5000/api/products";
function createProducts(event) {
    event.preventDefault(); // prevent form submission

    // Get the product details from the form
    var no_of_products = document.getElementById('no_of_products').value;
    var products = [];
    var productIds = []; // create a new array to store product IDs
    for (var i = 1; i <= no_of_products; i++) {
        var product_name = document.getElementById('product_' + i).value;
        products.push({ products_name: product_name });
    }

    // Create the object with a 'products' key
    var productsObj = {
        products: products
    };

    // Retrieve token from local storage
    var token = localStorage.getItem('token');

    // Make a POST request to the API to create the products
    fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(productsObj),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token // include the token in the request headers
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            var storedProducts = JSON.parse(localStorage.getItem('products')) || [];
            var storedIds = JSON.parse(localStorage.getItem('ids')) || [];
            for (var i = 0; i < data.ids.length; i++) {
                storedIds.push(data.ids[i]);
            }
            storedProducts = storedProducts.concat(products);
            localStorage.setItem('products', JSON.stringify(storedProducts));
            localStorage.setItem('ids', JSON.stringify(storedIds));

            // Add the product details to the table
            var product_table_body = document.getElementById('product_table_body');
            for (var i = 0; i < products.length; i++) {
                var product = products[i];
                var row = document.createElement('tr');

                if (product.products_name === "") {
                    alert("Please Fill the Product Name")
                } else {
                    // S.No.
                    var cell_sno = document.createElement('td');
                    cell_sno.textContent = i + 1;
                    row.appendChild(cell_sno);
                    // Product Name
                    var cell_name = document.createElement('td');
                    cell_name.textContent = product.products_name;
                    row.appendChild(cell_name);

                    // Status
                    var cell_status = document.createElement('td');
                    cell_status.textContent = 'Active'; // set default value
                    row.appendChild(cell_status);

                    // Date & Time
                    var cell_date = document.createElement('td');
                    cell_date.textContent = new Date().toLocaleString(); // set current date & time
                    row.appendChild(cell_date);

                    // Edit Button
                    var cell_edit = document.createElement('td');
                    var edit_button = document.createElement('a');
                    edit_button.classList.add('btn', 'btn-primary', 'btn-sm');
                    edit_button.innerHTML = '<span class="fa fa-pencil-square-o" aria-hidden="true"></span> &nbsp;Edit';
                    edit_button.href = '#'; // TODO: add link to edit page
                    edit_button.setAttribute('id', 'edit-' + data.ids[i]);
                    productIds.push(data.ids[i]); // push the product ID to the array
                    edit_button.onclick = function () {
                        // Create an input field to edit the product name
                        var input_field = document.createElement('input');
                        input_field.setAttribute('type', 'text');
                        input_field.setAttribute('id', 'edit-product-name-' + i);
                        input_field.setAttribute('value', product.products_name);
                        cell_edit.appendChild(input_field);

                        // Create a label for the input field
                        var label = document.createElement('label');
                        label.setAttribute('for', 'edit-product-name-' + i);
                        label.textContent = 'Enter your Product name';

                        // Create an update button to update the product name
                        var update_button = document.createElement('button');
                        update_button.classList.add('btn', 'btn-primary', 'btn-sm')
                        update_button.textContent = 'Update';
                        update_button.setAttribute('id', 'update-' + (i));
                        update_button.addEventListener('click', function () {
                            var productId = productIds[parseInt(this.id.split('-')[1])];
                            var productName = input_field.value;

                            // Make a PUT request to update the product
                            fetch(apiUrl + '/' + productId, {
                                method: "PUT",
                                body: JSON.stringify({ products_name: productName }),
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + token // include the token in the request headers
                                }
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error("Network response was not ok");
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log("Data :" , data);
                                    alert("Your data is Updated Now reload the page")

                                    if (productName === "") {
                                        alert("Please fill the Product Name");
                                    } else {
                                        // Check if there is an object at the index productId - 1
                                        var index = productId - 1;
                                        if (index < 0 || index >= storedProducts.length) {
                                            // If not, create a new object with the 'products_name' property
                                            storedProducts.push({ products_name: productName });
                                        } else {
                                            // If there is, update the 'products_name' property of the object
                                            storedProducts[index].products_name = productName;
                                        }

                                        // Update the product name in the table
                                        var productNameElement = document.getElementById('product-name-' + i);
                                        if (productNameElement) {
                                            productNameElement.textContent = productName;
                                        }

                                        // Update the product name in local storage
                                        localStorage.setItem('products', JSON.stringify(storedProducts));
                                    }

                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alert('Product not found. Status: Failed');
                                });
                        });


                        cell_edit.appendChild(label);
                        cell_edit.appendChild(update_button);
                    }

                    cell_edit.appendChild(edit_button);
                    row.appendChild(cell_edit);

                    // Delete Button
                    var cell_delete = document.createElement('td');
                    var delete_button = document.createElement('a');
                    delete_button.classList.add('btn', 'btn-danger', 'btn-sm');
                    delete_button.innerHTML = '<span class="fa fa-trash-o" aria-hidden="true"></span> &nbsp;Delete';
                    delete_button.href = '#'; // TODO: add link to delete action
                    delete_button.setAttribute('id', 'delete-' + data.ids[i]);
                    productIds.push(data.ids[i]); // push the product ID to the array
                    delete_button.onclick = function () {
                        if (confirm('Are you sure you want to delete it?')) {
                            // Get the row to be deleted
                            var rowToDelete = this.closest('tr');
                            // Get the product ID from the row
                            var productId = this.getAttribute('id').split('-')[1];
                            // Get the product name from the row
                            var productName = rowToDelete.querySelector('td:nth-child(2)').textContent;

                            // Call the API to delete the product
                            fetch(apiUrl + '/' + productId, { method: 'DELETE' })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.status === 'success') {
                                        rowToDelete.remove();

                                        // Update the local storage to remove the deleted product
                                        var storedProducts = JSON.parse(localStorage.getItem('products')) || [];
                                        var updatedProducts = storedProducts.filter(function (product) {
                                            return product.products_name !== productName;
                                        });
                                        localStorage.setItem('products', JSON.stringify(updatedProducts));
                                        // Remove the product ID from the productIds array and update the localStorage
                                        var storedProductIds = JSON.parse(localStorage.getItem('ids')) || [];
                                        var updatedProductIds = storedProductIds.filter(function (id) {
                                            return id !== productId;
                                        });
                                        localStorage.setItem('ids', JSON.stringify(updatedProductIds));

                                    } else {
                                        alert(data.message);
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                    alert('Something went wrong while deleting the product.');
                                });
                        }

                        return false; // Prevent default link behavior
                    };

                    cell_delete.appendChild(delete_button);
                    row.appendChild(cell_delete);
                    row.setAttribute('id', 'row-' + product._id);
                }
                product_table_body.appendChild(row);
            };
        })
}

// window onload 
// window.onload = function () {
//     var storedProducts = JSON.parse(localStorage.getItem('products')) || [];
//     var storedIds = JSON.parse(localStorage.getItem('ids')) || [];
//     var productIds = [];

//     // Update the HTML table with the loaded data
//     var product_table_body = document.getElementById('product_table_body');

//     // Add all stored products to table
//     for (var i = 0; i < storedProducts.length; i++) {
//         var product = storedProducts[i];
//         var row = document.createElement('tr');

//         if (product.products_name === "") {
//             alert("Please Fill the Product Name");
//         } else {
//             // S.No.
//             var cell_sno = document.createElement('td');
//             cell_sno.textContent = i + 1;
//             row.appendChild(cell_sno);
//             // Product Name
//             var cell_name = document.createElement('td');
//             cell_name.textContent = product.products_name;
//             row.appendChild(cell_name);

//             // Status
//             var cell_status = document.createElement('td');
//             cell_status.textContent = 'Active'; // set default value
//             row.appendChild(cell_status);

//             // Date & Time
//             var cell_date = document.createElement('td');
//             cell_date.textContent = new Date().toLocaleString(); // set current date & time
//             row.appendChild(cell_date);

//             // Edit Button
//             var cell_edit = document.createElement('td');
//             var edit_button = document.createElement('a');
//             edit_button.classList.add('btn', 'btn-primary', 'btn-sm');
//             edit_button.innerHTML = '<span class="fa fa-pencil-square-o" aria-hidden="true"></span> &nbsp;Edit';
//             edit_button.href = '#'; // TODO: add link to edit page
//             edit_button.setAttribute('id', 'edit-' + storedIds[i]);
//             productIds.push(storedIds[i]); // push the product ID to the array
//             edit_button.onclick = function () {
//                 // Create an input field to edit the product name
//                 var input_field = document.createElement('input');
//                 input_field.setAttribute('type', 'text');
//                 input_field.setAttribute('id', 'edit-product-name-' + i);
//                 input_field.setAttribute('value', product.products_name);
//                 cell_edit.appendChild(input_field);

//                 // Create a label for the input field
//                 var label = document.createElement('label');
//                 label.setAttribute('for', 'edit-product-name-' + i);
//                 label.textContent = 'Enter your Product name';

//                 // Create an update button to update the product name
//                 var update_button = document.createElement('button');
//                 update_button.classList.add('btn', 'btn-primary', 'btn-sm')
//                 update_button.textContent = 'Update';
//                 update_button.setAttribute('id', 'update-' + (i));
//                 update_button.addEventListener('click', function () {
//                     var productId = productIds[parseInt(this.id.split('-')[1])];
//                     var productName = input_field.value;

//                     // Make a PUT request to update the product
//                     fetch(apiUrl + '/' + productId, {
//                         method: "PUT",
//                         body: JSON.stringify({ products_name: productName }),
//                         headers: {
//                             "Content-Type": "application/json",
//                             "Authorization": "Bearer " + token // include the token in the request headers
//                         }
//                     })
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error("Network response was not ok");
//                             }
//                             return response.json();
//                         })
//                         .then(data => {
//                             alert("Your data is Updated Now reload the page")

//                             if (productName === "") {
//                                 alert("Please fill the Product Name");
//                             } else {
//                                 // Check if there is an object at the index productId - 1
//                                 var index = productId - 1;
//                                 if (index < 0 || index >= storedProducts.length) {
//                                     // If not, create a new object with the 'products_name' property
//                                     storedProducts.push({ products_name: productName });
//                                 } else {
//                                     // If there is, update the 'products_name' property of the object
//                                     storedProducts[index].products_name = productName;
//                                 }

//                                 // Update the product name in the table
//                                 var productNameElement = document.getElementById('product-name-' + i);
//                                 if (productNameElement) {
//                                     productNameElement.textContent = productName;
//                                 }

//                                 // Update the product name in local storage
//                                 localStorage.setItem('products', JSON.stringify(storedProducts));
//                             }

//                         })
//                         .catch(error => {
//                             console.error('Error:', error);
//                             alert('Product not found. Status: Failed');
//                         });
//                 });


//                 cell_edit.appendChild(label);
//                 cell_edit.appendChild(update_button);
//             }

//             cell_edit.appendChild(edit_button);
//             row.appendChild(cell_edit);

//             // Delete Button
//             var cell_delete = document.createElement('td');
//             var delete_button = document.createElement('a');
//             delete_button.classList.add('btn', 'btn-danger', 'btn-sm');
//             delete_button.innerHTML = '<span class="fa fa-trash-o" aria-hidden="true"></span> &nbsp;Delete';
//             delete_button.href = '#'; // TODO: add link to delete action
//             delete_button.setAttribute('id', 'delete-' + storedIds[i]); // Set the ID of the delete button to the product ID
//             delete_button.onclick = function () {
//                 if (confirm('Are you sure you want to delete it?')) {
//                     // Get the row to be deleted
//                     var rowToDelete = this.closest('tr');
//                     // Get the product ID from the row
//                     var productId = this.getAttribute('id').split('-')[1];
//                     // Get the product Name from the row
//                     var productName = rowToDelete.querySelector('td:nth-child(2)').textContent;
//                     // Call the API to delete the product
//                     fetch(apiUrl + '/' + productId, { method: 'DELETE' })
//                         .then(response => response.json())
//                         .then(data => {
//                             if (data.status === 'success') {
//                                 rowToDelete.remove();

//                                 // Update the local storage to remove the deleted product
//                                 var storedProducts = JSON.parse(localStorage.getItem('products')) || [];

//                                 var updatedProducts = storedProducts.filter(function (product) {
//                                     return product.products_name !== productName;
//                                 });
//                                 localStorage.setItem('products', JSON.stringify(updatedProducts));

//                                 // Update the local storage to remove the deleted id
//                                 var storedProductIds = JSON.parse(localStorage.getItem('ids')) || [];
//                                 var updatedProductIds = storedProductIds.filter(function (id) {
//                                     return id !== productId;
//                                 });
//                                 localStorage.setItem('ids', JSON.stringify(updatedProductIds));
//                             } else {
//                                 alert(data.message);
//                             }
//                         })
//                         .catch(error => {
//                             console.error(error);
//                             alert('Something went wrong while deleting the product.');
//                         });
//                 }
//                 return false; // Prevent default link behavior
//             };

//             cell_delete.appendChild(delete_button);
//             row.appendChild(cell_delete);
//             row.setAttribute('id', 'row-' + storedIds[i]);
//         }
//         product_table_body.appendChild(row);
//     }
// };

















window.onload = function () {
    var storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    var storedIds = JSON.parse(localStorage.getItem('ids')) || [];
    var productIds = [];

    // Update the HTML table with the loaded data
    var product_table_body = document.getElementById('product_table_body');

    // Add all stored products to table
    for (var i = 0; i < storedProducts.length; i++) {
        var product = storedProducts[i];
        var row = document.createElement('tr');

        if (product.products_name === "") {
            alert("Please Fill the Product Name");
        } else {
            // S.No.
            var cell_sno = document.createElement('td');
            cell_sno.textContent = i + 1;
            row.appendChild(cell_sno);
            // Product Name
            var cell_name = document.createElement('td');
            cell_name.textContent = product.products_name;
            cell_name.setAttribute('id', 'product-name-' + i);
            row.appendChild(cell_name);

            // Status
            var cell_status = document.createElement('td');
            cell_status.textContent = 'Active'; // set default value
            row.appendChild(cell_status);

            // Date & Time
            var cell_date = document.createElement('td');
            cell_date.textContent = new Date().toLocaleString(); // set current date & time
            row.appendChild(cell_date);

            // Edit Button
            var cell_edit = document.createElement('td');
            var edit_button = document.createElement('a');
            edit_button.classList.add('btn', 'btn-primary', 'btn-sm');
            edit_button.innerHTML = '<span class="fa fa-pencil-square-o" aria-hidden="true"></span> &nbsp;Edit';
            edit_button.href = '#'; // TODO: add link to edit page
            edit_button.setAttribute('id', 'edit-' + storedIds[i]);
            productIds.push(storedIds[i]); // push the product ID to the array
            edit_button.onclick = function () {
                var productName = input_field.value;

                // Create an input field to edit the product name
                var input_field = document.createElement('input');
                input_field.setAttribute('type', 'text');
                input_field.setAttribute('id', 'edit-product-name-' + i);
                input_field.setAttribute('value', product.products_name);
                cell_edit.appendChild(input_field);

                // Create a label for the input field
                var label = document.createElement('label');
                label.setAttribute('for', 'edit-product-name-' + i);
                label.textContent = 'Enter your Product name';

                // Create an update button to update the product name
                var update_button = document.createElement('button');
                update_button.classList.add('btn', 'btn-primary', 'btn-sm')
                update_button.textContent = 'Update';
                update_button.setAttribute('id', 'update-' + (i));
                update_button.addEventListener('click', function () {
                    var productId = productIds[parseInt(this.id.split('-')[1])];

                    // Make a PUT request to update the product
                    fetch(apiUrl + '/' + productId, {
                        method: "PUT",
                        body: JSON.stringify({ products_name: productName }),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token // include the token in the request headers
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Data :" , data);
                            alert("Your data is Updated Now reload the page")

                            if (productName === "") {
                                alert("Please fill the Product Name");
                            } else {
                                // Check if there is an object at the index productId - 1
                                var index = productId - 1;
                                if (index < 0 || index >= storedProducts.length) {
                                    // If not, create a new object with the 'products_name' property
                                    storedProducts.push({ products_name: productName });
                                } else {
                                    // If there is, update the 'products_name' property of the object
                                    storedProducts[index].products_name = productName;
                                }

                                // Update the product name in the table
                                var productNameElement = document.getElementById('product-name-' + i);
                                if (productNameElement) {
                                    productNameElement.textContent = productName;
                                }

                                // Update the product name in local storage
                                localStorage.setItem('products', JSON.stringify(storedProducts));
                            }

                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Product not found. Status: Failed');
                        });
                });


                cell_edit.appendChild(label);
                cell_edit.appendChild(update_button);
            }

            cell_edit.appendChild(edit_button);
            row.appendChild(cell_edit);

            // Delete Button
            var cell_delete = document.createElement('td');
            var delete_button = document.createElement('a');
            delete_button.classList.add('btn', 'btn-danger', 'btn-sm');
            delete_button.innerHTML = '<span class="fa fa-trash-o" aria-hidden="true"></span> &nbsp;Delete';
            delete_button.href = '#'; // TODO: add link to delete action
            delete_button.setAttribute('id', 'delete-' + storedIds[i]); // Set the ID of the delete button to the product ID
            delete_button.onclick = function () {
                if (confirm('Are you sure you want to delete it?')) {
                    // Get the row to be deleted
                    var rowToDelete = this.closest('tr');
                    // Get the product ID from the row
                    var productId = this.getAttribute('id').split('-')[1];
                    // Get the product Name from the row
                    var productName = rowToDelete.querySelector('td:nth-child(2)').textContent;
                    // Call the API to delete the product
                    fetch(apiUrl + '/' + productId, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                rowToDelete.remove();

                                // Update the local storage to remove the deleted product
                                var storedProducts = JSON.parse(localStorage.getItem('products')) || [];

                                var updatedProducts = storedProducts.filter(function (product) {
                                    return product.products_name !== productName;
                                });
                                localStorage.setItem('products', JSON.stringify(updatedProducts));

                                // Update the local storage to remove the deleted id
                                var storedProductIds = JSON.parse(localStorage.getItem('ids')) || [];
                                var updatedProductIds = storedProductIds.filter(function (id) {
                                    return id !== productId;
                                });
                                localStorage.setItem('ids', JSON.stringify(updatedProductIds));
                            } else {
                                alert(data.message);
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            alert('Something went wrong while deleting the product.');
                        });
                }
                return false; // Prevent default link behavior
            };

            cell_delete.appendChild(delete_button);
            row.appendChild(cell_delete);
            row.setAttribute('id', 'row-' + storedIds[i]);
        }
        product_table_body.appendChild(row);
    }
};