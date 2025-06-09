const COLLECTION_ID = '68454d388c39cdc31dbbdd94'; // replace with your products collection ID
const API_TOKEN = 'e4aad0b7e7d0f67be1de3511c9fe30476df73d2e7cb970a9fb43606014666c09'; // your API token

const API_URL = `https://api.webflow.com/v2/sites/68454d388c39cdc31dbbdd38/products`;

export async function fetchProducts() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'accept-version': '1.0.0',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Webflow returns products in data.products (for ecommerce)
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}