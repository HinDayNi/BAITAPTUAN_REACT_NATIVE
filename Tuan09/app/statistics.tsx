import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import * as DB from "../database/db";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"; // Import Expo Icons

const COLORS = {
  primary: "#6495ED",
  primaryDark: "#304674",
  primaryLight: "#EEF3FF",
  secondary: "#98AFC7",
  text: "#1F2937",
  textLight: "#6B7280",
  background: "#F9FAFB",
  white: "#FFFFFF",
  income: "#10B981",
  incomeLight: "#D1FAE5",
  expense: "#EF4444",
  expenseLight: "#FEE2E2",
  border: "#E5E7EB",
  shadowColor: "rgba(0, 0, 0, 0.1)",
};

interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
}

interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 280;
const BAR_WIDTH = 35;

export default function Statistics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const calculateMonthlyStats = React.useCallback((data: Transaction[]) => {
    const statsMap = new Map<string, MonthlyStats>();

    const parseDate = (value: string) => {
      const d1 = new Date(value);
      if (!isNaN(d1.getTime())) return d1;
      const m = value.match(
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
      );
      if (m) {
        const day = Number(m[1]);
        const mon = Number(m[2]) - 1;
        const year = Number(m[3]);
        const hour = Number(m[4] || 0);
        const minute = Number(m[5] || 0);
        const second = Number(m[6] || 0);
        return new Date(year, mon, day, hour, minute, second);
      }
      return new Date();
    };

    data.forEach((txn) => {
      const d = parseDate(txn.createdAt);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = String(d.getFullYear());
      const month = `${mm}/${yyyy}`; // MM/YYYY

      if (!statsMap.has(month)) {
        statsMap.set(month, { month, income: 0, expense: 0, balance: 0 });
      }

      const stat = statsMap.get(month)!;
      if (txn.type === "Thu") {
        stat.income += txn.amount;
      } else {
        stat.expense += txn.amount;
      }
      stat.balance = stat.income - stat.expense;
    });

    const statsArray = Array.from(statsMap.values()).sort((a, b) => {
      const [monthA, yearA] = a.month.split("/").map(Number);
      const [monthB, yearB] = b.month.split("/").map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });

    const last6Months = statsArray.slice(-6);
    setMonthlyStats(last6Months);

    if (last6Months.length > 0) {
      setSelectedMonth(last6Months[last6Months.length - 1].month);
    }
  }, []);

  const loadData = React.useCallback(async () => {
    try {
      const data = await DB.getAllTransactions();
      setTransactions(data);
      calculateMonthlyStats(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  }, [calculateMonthlyStats]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getMaxValue = () => {
    const max = Math.max(...monthlyStats.flatMap((s) => [s.income, s.expense]));
    return max > 0 ? max : 1;
  };

  const renderBarChart = () => {
    const maxValue = getMaxValue();
    const barGap = 10;
    const groupWidth = BAR_WIDTH * 2 + barGap;
    const totalWidth = monthlyStats.length * (groupWidth + 20);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <View
          style={[
            styles.chartContainer,
            { width: Math.max(CHART_WIDTH, totalWidth) },
          ]}
        >
          <View style={styles.yAxisContainer}>
            <Text style={styles.yAxisLabel}>
              {(maxValue / 1_000_000).toFixed(0)}M
            </Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>
          <View style={styles.barsContainer}>
            {monthlyStats.map((stat) => {
              const barAreaHeight = CHART_HEIGHT - 40;
              const incomeHeight = (stat.income / maxValue) * barAreaHeight;
              const expenseHeight = (stat.expense / maxValue) * barAreaHeight;

              return (
                <TouchableOpacity
                  key={stat.month}
                  style={styles.barGroup}
                  onPress={() => setSelectedMonth(stat.month)}
                >
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          backgroundColor: COLORS.income,
                          height: incomeHeight,
                          width: BAR_WIDTH,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          backgroundColor: COLORS.expense,
                          height: expenseHeight,
                          width: BAR_WIDTH,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.monthLabel,
                      selectedMonth === stat.month && styles.monthLabelActive,
                    ]}
                  >
                    {stat.month.split("/")[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  const getSelectedStats = () => {
    return monthlyStats.find((stat) => stat.month === selectedMonth);
  };

  const getTotalIncome = () => {
    return transactions
      .filter((txn) => txn.type === "Thu")
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter((txn) => txn.type === "Chi")
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getCategoryStats = () => {
    const categoryMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((txn) => {
      if (!categoryMap.has(txn.category)) {
        categoryMap.set(txn.category, { income: 0, expense: 0 });
      }
      const stat = categoryMap.get(txn.category)!;
      if (txn.type === "Thu") {
        stat.income += txn.amount;
      } else {
        stat.expense += txn.amount;
      }
    });

    return Array.from(categoryMap.entries())
      .map(([category, stats]) => ({
        category,
        ...stats,
        total: stats.expense,
      }))
      .sort((a, b) => b.total - a.total);
  };

  const selectedStats = getSelectedStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THỐNG KÊ TÀI CHÍNH</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="bar-chart-2" size={20} color={COLORS.primary} /> Tổng
            quan
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng thu</Text>
              <Text style={[styles.summaryAmount, styles.incomeText]}>
                +{getTotalIncome().toLocaleString()}₫
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng chi</Text>
              <Text style={[styles.summaryAmount, styles.expenseText]}>
                -{getTotalExpense().toLocaleString()}₫
              </Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Số dư toàn thời gian</Text>
            <Text
              style={[
                styles.balanceAmount,
                getTotalIncome() - getTotalExpense() >= 0
                  ? styles.incomeText
                  : styles.expenseText,
              ]}
            >
              {(getTotalIncome() - getTotalExpense()).toLocaleString()}₫
            </Text>
          </View>
        </View>

        {/* Monthly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="trending-up" size={20} color={COLORS.primary} /> Biểu
            đồ 6 tháng gần nhất
          </Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: COLORS.income }]}
              />
              <Text style={styles.legendText}>Thu</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: COLORS.expense },
                ]}
              />
              <Text style={styles.legendText}>Chi</Text>
            </View>
          </View>
          {monthlyStats.length > 0 ? (
            renderBarChart()
          ) : (
            <View style={styles.emptyChart}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={48}
                color={COLORS.textLight}
              />
              <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
            </View>
          )}
        </View>
        {selectedStats && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              <Feather name="calendar" size={20} color={COLORS.primary} /> Chi
              tiết tháng {selectedStats.month}
            </Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thu nhập</Text>
              <Text style={[styles.detailAmount, styles.incomeText]}>
                +{selectedStats.income.toLocaleString()}₫
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Chi tiêu</Text>
              <Text style={[styles.detailAmount, styles.expenseText]}>
                -{selectedStats.expense.toLocaleString()}₫
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowBorder]}>
              <Text style={[styles.detailLabel, styles.detailLabelBold]}>
                Số dư
              </Text>
              <Text
                style={[
                  styles.detailAmount,
                  styles.detailAmountBold,
                  selectedStats.balance >= 0
                    ? styles.incomeText
                    : styles.expenseText,
                ]}
              >
                {selectedStats.balance.toLocaleString()}₫
              </Text>
            </View>
          </View>
        )}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="tag" size={20} color={COLORS.primary} /> Phân tích
            chi tiêu theo danh mục
          </Text>
          {getCategoryStats().map((stat) => {
            const totalExpense = getTotalExpense();
            const percentage =
              totalExpense > 0 ? (stat.expense / totalExpense) * 100 : 0;

            return (
              <View key={stat.category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{stat.category}</Text>
                  <Text style={styles.categoryAmount}>
                    -{stat.expense.toLocaleString()}₫
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.categoryPercentage}>
                  Chiếm {percentage.toFixed(1)}% tổng chi tiêu
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    marginVertical: 10,
    padding: 24,
    borderRadius: 24,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  summaryRow: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  incomeText: {
    color: COLORS.income,
  },
  expenseText: {
    color: COLORS.expense,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "900",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  chartContainer: {
    height: CHART_HEIGHT,
    flexDirection: "row",
    paddingVertical: 10,
    marginHorizontal: 0,
  },
  yAxisContainer: {
    width: 50,
    justifyContent: "space-between",
    paddingBottom: 30,
    paddingVertical: 0,
  },
  yAxisLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "right",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  barGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    borderRadius: 6,
    minHeight: 2,
  },
  monthLabel: {
    position: "absolute",
    bottom: -20,
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    width: BAR_WIDTH * 2 + 6,
    textAlign: "center",
  },
  monthLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  emptyChart: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 8,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 10,
    paddingTop: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  detailLabelBold: {
    fontSize: 16,
    fontWeight: "700",
  },
  detailAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailAmountBold: {
    fontSize: 20,
    fontWeight: "800",
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.expense,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.expenseLight,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.expense,
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
});
