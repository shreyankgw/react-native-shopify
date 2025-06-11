const CUSTOMER_API_ENDPOINT = "https://shopify.com/63263310018/account/customer/api/2025-01/graphql";

export async function createCustomerAddress(token, addressInput) {
    const { defaultAddress, ...addressforMutation} = addressInput;
    const response = await fetch(CUSTOMER_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            query: `
        mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
          customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
            customerAddress {
              id
            }
            userErrors {
                field
                message
            }
          }
        }
      `,
            variables: {
                address: addressforMutation,
                defaultAddress: defaultAddress ?? false
            }
        })
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0]?.message || "Unknown Shopify error");
    if (data.customerAddressCreate.userErrors.length > 0) {
        throw new Error(data.customerAddressCreate.userErrors[0].message);
    }
    return data.customerAddressCreate.customerAddress;
}

export async function updateCustomerAddress(token, addressInput) {
    const { defaultAddress, id, ...addressforMutation } = addressInput;
    
    const response = await fetch(CUSTOMER_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            query: `
        mutation customerAddressUpdate($address: CustomerAddressInput, $addressId: ID!, $defaultAddress: Boolean) {
          customerAddressUpdate(address: $address, addressId: $addressId, defaultAddress: $defaultAddress) {
            customerAddress {
              id
            }
            userErrors {
                field
                message
            }
          }
        }
      `,
        variables: {
                addressId: id,
                address: addressforMutation,
                defaultAddress: defaultAddress ?? false
          }
        })
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0]?.message || "Unknown Shopify error");
    if (data.customerAddressUpdate.userErrors.length > 0) {
        throw new Error(data.customerAddressUpdate.userErrors[0].message);
    }
    return data.customerAddressUpdate.customerAddress;
}

export async function deleteCustomerAddress(token, addressId) {
    const response = await fetch(CUSTOMER_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            query: `
        mutation customerAddressDelete($addressId: ID!) {
          customerAddressDelete(addressId: $addressId) {
             deletedAddressId
            userErrors {
              field
              message
            }
          }
        }
      `,
        variables: {
            addressId: addressId
         }
      })
    });

    const { data, errors } = await response.json();
    if (errors) throw new Error(errors[0]?.message || "Unknown Shopify error");
    if (data.customerAddressDelete.userErrors.length > 0) {
        throw new Error(data.customerAddressDelete.userErrors[0].message);
    }
    return data.customerAddressDelete.deletedAddressId;
}


export async function updateCustomerName(token, firstName, lastName ) {
  const response = await fetch(CUSTOMER_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      query: `
        mutation customerUpdate($input: CustomerUpdateInput!) {
          customerUpdate(input: $input) {
            customer {
              firstName
              lastName
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          firstName,
          lastName
        }
      }
    })
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0]?.message || "Unknown Shopify error");
  if (data.customerUpdate.userErrors.length > 0) {
    throw new Error(data.customerUpdate.userErrors[0].message);
  }
  return data.customerUpdate.customer;
}

