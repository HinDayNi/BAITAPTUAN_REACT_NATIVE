export interface PhoneColor {
  name: string;
  color: string;
  image: string;
}

export interface Phone {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviewCount: number;
  colors: PhoneColor[];
  discount: string;
  supplier: string;
}

const API_BASE_URL = "https://68e4b9ae8e116898997c96f8.mockapi.io/phones";
export const phoneApi = {
  // Lấy thông tin điện thoại
  getPhone: async (id: string = "1"): Promise<Phone> => {
    try {
      const response = await fetch(`${API_BASE_URL}/phones/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch phone data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching phone:", error);
      throw error;
    }
  },

  // Cập nhật màu đã chọn
  updateSelectedColor: async (
    phoneId: string,
    selectedColor: string
  ): Promise<Phone> => {
    try {
      const response = await fetch(`${API_BASE_URL}/phones/${phoneId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedColor: selectedColor,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update phone data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating phone:", error);
      throw error;
    }
  },
};
