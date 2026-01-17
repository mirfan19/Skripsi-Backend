
const http = require('http');

// Configuration
const API_PORT = 3001; // Adjust if your server runs on a different port
const API_HOST = 'localhost';

async function runTest() {
    console.log('--- Starting Product Update Test ---');

    // 1. Get all products to find a valid ID
    console.log('\n1. Fetching first product to get ID...');
    const products = await makeRequest('/api/v1/products', 'GET');

    if (!products.body.data || products.body.data.length === 0) {
        console.error('No products found to test update with.');
        return;
    }

    const productId = products.body.data[0].ProductID;
    console.log(`Target Product ID: ${productId}`);

    // 2. Test Invalid SupplierID (Reproduction of 500 error)
    console.log('\n2. Testing Invalid SupplierID Update (Expecting 400 after fix, currently 500)...');
    const invalidPayload = JSON.stringify({
        ProductName: 'Test Product',
        Description: 'Test Description',
        Price: 10000,
        StockQuantity: 10,
        SupplierID: 'InvalidSupplier', // This causes NaN and crash
        Category: 'New Category'
    });

    try {
        const response = await makeRequest(`/api/v1/admin/products/${productId}`, 'PUT', invalidPayload);
        console.log(`Response Status: ${response.statusCode}`);
        console.log('Response Body:', response.body);
    } catch (err) {
        console.log('Request failed (expected if crashing):', err.message);
    }

    // 3. Test Valid SupplierID + Category Update
    console.log('\n3. Testing Valid Update with Category...');
    // Need a valid supplier ID from the product or just 1 (assuming 1 exists or use the one from product)
    const validSupplierId = products.body.data[0].SupplierID || 1;

    const validPayload = JSON.stringify({
        ProductName: 'Updated Product Name',
        Description: 'Updated Description',
        Price: 15000,
        StockQuantity: 20,
        SupplierID: validSupplierId,
        Category: 'Updated Category'
    });

    try {
        const response = await makeRequest(`/api/v1/admin/products/${productId}`, 'PUT', validPayload);
        console.log(`Response Status: ${response.statusCode}`);
        console.log('Response Body:', response.body);
    } catch (err) {
        console.error('Request failed:', err);
    }
}

function makeRequest(path, method, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (body) {
            options.headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        body: data ? JSON.parse(data) : {}
                    });
                } catch (e) {
                    // If response is not JSON (e.g. HTML error page from 500)
                    resolve({
                        statusCode: res.statusCode,
                        body: data
                    });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(body);
        }
        req.end();
    });
}

runTest();
