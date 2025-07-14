export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


export function buildFormDataForCreation(formData, data, parentKey = "") {
    if (data instanceof File) {
      formData.append(parentKey, data);
    } else if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const key = `${parentKey}[${index}]`;
        buildFormDataForCreation(formData, item, key);
      });
    } else if (data !== null && typeof data === "object") {
      Object.entries(data).forEach(([k, v]) => {
        const newKey = parentKey ? `${parentKey}[${k}]` : k;
        buildFormDataForCreation(formData, v, newKey);
      });
    } else if (parentKey && data!=null && data!=undefined) {
      formData.append(parentKey, String(data));
    }
}

export function buildFormDataForUpdate(formData, data, parentKey = "") {
    if (data instanceof File) {
      formData.append(parentKey, data);
    } else if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const key = `${parentKey}[${index}]`;
        buildFormDataForUpdate(formData, item, key);
      });
    } else if (data !== null && typeof data === "object") {
      // Include 'id' directly if it exists
      if (data.id !== undefined && parentKey) {
        formData.append(`${parentKey}[id]`, String(data.id));
      }
  
      Object.entries(data).forEach(([k, v]) => {
        if (k === "id") return; // already handled above
        const newKey = parentKey ? `${parentKey}[${k}]` : k;
        buildFormDataForUpdate(formData, v, newKey);
      });
    } else if (parentKey && data!==null && data!==undefined) {
      formData.append(parentKey, String(data));
    }
  }