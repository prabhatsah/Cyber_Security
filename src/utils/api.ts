// src/utils/api.ts
export async function createTable(tableName: string, columns: { name: string; type: string }[]) {
    const res = await fetch("/api/dbApis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableName, columns }),
    });
  
    return res.json();
  }
  
  export async function addColumn(tableName: string, columnName: string, columnType: string) {
    const res = await fetch("/api/dbApis", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableName, columnName, columnType }),
    });
  
    return res.json();
  }
  
  export async function deleteTable(tableName: string) {
    const res = await fetch("/api/dbApis", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableName }),
    });
  
    return res.json();
  }
  
  export async function getTables() {
    const res = await fetch("/api/dbApis", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    return res.json();
  }
  