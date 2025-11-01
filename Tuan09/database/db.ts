import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
  isDeleted?: number; // 0 = active, 1 = deleted
  deletedAt?: string;
}

// AsyncStorage keys
const TRANSACTIONS_KEY = "@transactions";
const COUNTER_KEY = "@transaction_counter";

// Helper functions for AsyncStorage
const getAllStoredTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading transactions:", error);
    return [];
  }
};

const saveAllTransactions = async (
  transactions: Transaction[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
    throw error;
  }
};

const getNextId = async (): Promise<number> => {
  try {
    const counter = await AsyncStorage.getItem(COUNTER_KEY);
    const nextId = counter ? parseInt(counter) + 1 : 1;
    await AsyncStorage.setItem(COUNTER_KEY, nextId.toString());
    return nextId;
  } catch (error) {
    console.error("Error getting next ID:", error);
    return Date.now(); // Fallback to timestamp
  }
};

// Khởi tạo database (AsyncStorage không cần init, nhưng giữ để tương thích)
export const initDatabase = async (): Promise<void> => {
  try {
    // Đảm bảo có key transactions trong AsyncStorage
    const existingData = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (existingData === null) {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
    }

    // Đảm bảo có counter
    const existingCounter = await AsyncStorage.getItem(COUNTER_KEY);
    if (existingCounter === null) {
      await AsyncStorage.setItem(COUNTER_KEY, "0");
    }

    console.log("AsyncStorage database initialized successfully");
  } catch (error) {
    console.error("Error initializing AsyncStorage database:", error);
    throw error;
  }
};

// Thêm giao dịch mới (bất đồng bộ)
export const addTransaction = async (
  transaction: Transaction
): Promise<number> => {
  try {
    const transactions = await getAllStoredTransactions();
    const newId = await getNextId();

    const newTransaction: Transaction = {
      ...transaction,
      id: newId,
      isDeleted: 0,
    };

    transactions.push(newTransaction);
    await saveAllTransactions(transactions);

    console.log("Transaction added with ID:", newId);
    return newId;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Lấy tất cả giao dịch chưa xóa (bất đồng bộ)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await getAllStoredTransactions();

    const activeTransactions = transactions
      .filter((t) => t.isDeleted === 0)
      .sort((a, b) => (b.id || 0) - (a.id || 0)); // Sort by ID DESC

    console.log("Fetched transactions:", activeTransactions.length);
    return activeTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Lấy tất cả giao dịch đã xóa (bất đồng bộ)
export const getDeletedTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await getAllStoredTransactions();

    const deletedTransactions = transactions
      .filter((t) => t.isDeleted === 1)
      .sort((a, b) => {
        // Sort by deletedAt DESC
        if (!a.deletedAt || !b.deletedAt) return 0;
        return (
          new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
        );
      });

    console.log("Fetched deleted transactions:", deletedTransactions.length);
    return deletedTransactions;
  } catch (error) {
    console.error("Error fetching deleted transactions:", error);
    throw error;
  }
};

// Tìm kiếm giao dịch chưa xóa (bất đồng bộ)
export const searchTransactions = async (
  searchText: string
): Promise<Transaction[]> => {
  try {
    const transactions = await getAllStoredTransactions();
    const searchLower = searchText.toLowerCase();

    const filteredTransactions = transactions
      .filter(
        (t) =>
          t.isDeleted === 0 &&
          (t.title.toLowerCase().includes(searchLower) ||
            t.category.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => (b.id || 0) - (a.id || 0)); // Sort by ID DESC

    console.log("Search results:", filteredTransactions.length);
    return filteredTransactions;
  } catch (error) {
    console.error("Error searching transactions:", error);
    throw error;
  }
};

// Tìm kiếm giao dịch đã xóa (bất đồng bộ)
export const searchDeletedTransactions = async (
  searchText: string
): Promise<Transaction[]> => {
  try {
    const transactions = await getAllStoredTransactions();
    const searchLower = searchText.toLowerCase();

    const filteredTransactions = transactions
      .filter(
        (t) =>
          t.isDeleted === 1 &&
          (t.title.toLowerCase().includes(searchLower) ||
            t.category.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => {
        // Sort by deletedAt DESC
        if (!a.deletedAt || !b.deletedAt) return 0;
        return (
          new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
        );
      });

    console.log("Search deleted results:", filteredTransactions.length);
    return filteredTransactions;
  } catch (error) {
    console.error("Error searching deleted transactions:", error);
    throw error;
  }
};

// Cập nhật giao dịch (bất đồng bộ)
// Chỉ cập nhật các trường có thể chỉnh sửa, không động vào isDeleted và deletedAt
export const updateTransaction = async (
  id: number,
  transaction: Transaction
): Promise<void> => {
  try {
    const transactions = await getAllStoredTransactions();

    const index = transactions.findIndex(
      (t) => t.id === id && t.isDeleted === 0
    );
    if (index === -1) {
      throw new Error("Transaction not found or already deleted");
    }

    // Update only editable fields
    transactions[index] = {
      ...transactions[index],
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
    };

    await saveAllTransactions(transactions);
    console.log("Transaction updated:", id);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Xóa mềm giao dịch (soft delete - bất đồng bộ)
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const transactions = await getAllStoredTransactions();

    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const deletedAt = new Date().toLocaleString("vi-VN");
    transactions[index] = {
      ...transactions[index],
      isDeleted: 1,
      deletedAt: deletedAt,
    };

    await saveAllTransactions(transactions);
    console.log("Transaction soft deleted:", id);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Khôi phục giao dịch đã xóa (bất đồng bộ)
export const restoreTransaction = async (id: number): Promise<void> => {
  try {
    const transactions = await getAllStoredTransactions();

    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    transactions[index] = {
      ...transactions[index],
      isDeleted: 0,
      deletedAt: undefined,
    };

    await saveAllTransactions(transactions);
    console.log("Transaction restored:", id);
  } catch (error) {
    console.error("Error restoring transaction:", error);
    throw error;
  }
};

// Xóa vĩnh viễn giao dịch (hard delete - bất đồng bộ)
export const permanentDeleteTransaction = async (id: number): Promise<void> => {
  try {
    const transactions = await getAllStoredTransactions();

    const filteredTransactions = transactions.filter((t) => t.id !== id);

    await saveAllTransactions(filteredTransactions);
    console.log("Transaction permanently deleted:", id);
  } catch (error) {
    console.error("Error permanently deleting transaction:", error);
    throw error;
  }
};

// Thêm dữ liệu mẫu (bất đồng bộ)
export const addSampleData = async (): Promise<void> => {
  try {
    const sampleTransactions: Transaction[] = [
      {
        title: "Lương tháng 10",
        amount: 15000000,
        category: "Khác",
        createdAt: "30/10/2025, 09:00:00",
        type: "Thu",
      },
      {
        title: "Mua sắm Lotte Mart",
        amount: 850000,
        category: "Mua sắm",
        createdAt: "31/10/2025, 14:30:00",
        type: "Chi",
      },
      {
        title: "Tiền điện tháng 10",
        amount: 450000,
        category: "Hóa đơn",
        createdAt: "1/11/2025, 08:15:00",
        type: "Chi",
      },
    ];

    for (const transaction of sampleTransactions) {
      await addTransaction(transaction);
    }

    console.log("Sample data added successfully");
  } catch (error) {
    console.error("Error adding sample data:", error);
    throw error;
  }
};

// ==================== SYNC API FUNCTIONS ====================

// Interface cho API transaction (không có isDeleted, deletedAt)
export interface ApiTransaction {
  id?: string;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
}

// Lấy tất cả giao dịch từ API
export const fetchAllFromApi = async (
  apiUrl: string
): Promise<ApiTransaction[]> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // Nếu là lỗi 404, có thể do chưa có dữ liệu, trả về mảng rỗng
      if (response.status === 404) {
        console.log("API endpoint not found or empty, returning empty array");
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching from API:", error);
    // Nếu là lỗi network hoặc URL không hợp lệ
    if (error instanceof TypeError) {
      throw new Error("Không thể kết nối đến API. Vui lòng kiểm tra lại URL.");
    }
    throw error;
  }
};

// Xóa tất cả dữ liệu trên API
export const deleteAllFromApi = async (apiUrl: string): Promise<void> => {
  try {
    // Lấy tất cả items
    const items = await fetchAllFromApi(apiUrl);

    // Nếu không có items, không cần xóa
    if (items.length === 0) {
      console.log("No items to delete from API");
      return;
    }

    // Xóa từng item
    const deletePromises = items.map((item) =>
      fetch(`${apiUrl}/${item.id}`, { method: "DELETE" })
    );

    await Promise.all(deletePromises);
    console.log(`Deleted ${items.length} items from API`);
  } catch (error) {
    console.error("Error deleting from API:", error);
    throw error;
  }
};

// Upload một giao dịch lên API
export const uploadToApi = async (
  apiUrl: string,
  transaction: Transaction
): Promise<void> => {
  try {
    // Chuyển đổi Transaction thành ApiTransaction (bỏ isDeleted, deletedAt, id)
    const apiTransaction: ApiTransaction = {
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      createdAt: transaction.createdAt,
      type: transaction.type,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiTransaction),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error uploading to API:", error);
    throw error;
  }
};

// Đồng bộ: Xóa tất cả trên API và upload lại từ local DB
export const syncToApi = async (apiUrl: string): Promise<number> => {
  try {
    // Bước 1: Xóa tất cả dữ liệu trên API
    await deleteAllFromApi(apiUrl);

    // Bước 2: Lấy tất cả giao dịch chưa xóa từ local database
    const localTransactions = await getAllTransactions();

    // Bước 3: Upload từng giao dịch lên API
    for (const transaction of localTransactions) {
      await uploadToApi(apiUrl, transaction);
    }

    console.log(`Synced ${localTransactions.length} transactions to API`);
    return localTransactions.length;
  } catch (error) {
    console.error("Error syncing to API:", error);
    throw error;
  }
};
