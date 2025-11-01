import React, { useState, useEffect } from "react";
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
const CHART_WIDTH = width - 32;
const CHART_HEIGHT = 300;
const BAR_WIDTH = 40;

export default function Statistics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const calculateMonthlyStats = React.useCallback((data: Transaction[]) => {
    const statsMap = new Map<string, MonthlyStats>();

    data.forEach((txn) => {
      // Parse date from Vietnamese format: "31/10/2025, 14:30:00"
      const dateParts = txn.createdAt.split(",")[0].split("/");
      const month = `${dateParts[1]}/${dateParts[2]}`; // MM/YYYY

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

    // Convert to array and sort by date
    const statsArray = Array.from(statsMap.values()).sort((a, b) => {
      const [monthA, yearA] = a.month.split("/").map(Number);
      const [monthB, yearB] = b.month.split("/").map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });

    // Get last 6 months
    const last6Months = statsArray.slice(-6);
    setMonthlyStats(last6Months);

    // Set current month as selected
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getMaxValue = () => {
    const max = Math.max(
      ...monthlyStats.flatMap((stat) => [stat.income, stat.expense])
    );
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
        style={styles.chartScrollView}
      >
        <View
          style={[
            styles.chartContainer,
            { width: Math.max(CHART_WIDTH, totalWidth) },
          ]}
        >
          {/* Y-axis labels */}
          <View style={styles.yAxisContainer}>
            <Text style={styles.yAxisLabel}>
              {(maxValue / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.yAxisLabel}>
              {(maxValue / 2000000).toFixed(1)}M
            </Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>

          {/* Bars */}
          <View style={styles.barsContainer}>
            {monthlyStats.map((stat, index) => {
              const incomeHeight =
                (stat.income / maxValue) * (CHART_HEIGHT - 60);
              const expenseHeight =
                (stat.expense / maxValue) * (CHART_HEIGHT - 60);

              return (
                <TouchableOpacity
                  key={stat.month}
                  style={styles.barGroup}
                  onPress={() => setSelectedMonth(stat.month)}
                >
                  {/* Income Bar */}
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        styles.incomeBar,
                        {
                          height: incomeHeight,
                          width: BAR_WIDTH,
                        },
                      ]}
                    />
                  </View>

                  {/* Expense Bar */}
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        styles.expenseBar,
                        {
                          height: expenseHeight,
                          width: BAR_WIDTH,
                        },
                      ]}
                    />
                  </View>

                  {/* Month label */}
                  <Text
                    style={[
                      styles.monthLabel,
                      selectedMonth === stat.month && styles.monthLabelActive,
                    ]}
                  >
                    {stat.month}
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
        total: stats.expense, // Sort by expense
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
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THỐNG KÊ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Tổng quan</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng thu</Text>
              <Text style={[styles.summaryAmount, styles.incomeText]}>
                +₫{getTotalIncome().toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tổng chi</Text>
              <Text style={[styles.summaryAmount, styles.expenseText]}>
                -₫{getTotalExpense().toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
            <Text
              style={[
                styles.balanceAmount,
                getTotalIncome() - getTotalExpense() >= 0
                  ? styles.incomeText
                  : styles.expenseText,
              ]}
            >
              ₫{(getTotalIncome() - getTotalExpense()).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Monthly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Biểu đồ theo tháng</Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.incomeBar]} />
              <Text style={styles.legendText}>Thu</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.expenseBar]} />
              <Text style={styles.legendText}>Chi</Text>
            </View>
          </View>

          {monthlyStats.length > 0 ? (
            renderBarChart()
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
            </View>
          )}
        </View>

        {/* Selected Month Details */}
        {selectedStats && (
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>
              Chi tiết tháng {selectedStats.month}
            </Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thu nhập</Text>
              <Text style={[styles.detailAmount, styles.incomeText]}>
                +₫{selectedStats.income.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Chi tiêu</Text>
              <Text style={[styles.detailAmount, styles.expenseText]}>
                -₫{selectedStats.expense.toLocaleString()}
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
                ₫{selectedStats.balance.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Category Statistics */}
        <View style={styles.categoryCard}>
          <Text style={styles.cardTitle}>Thống kê theo danh mục</Text>
          {getCategoryStats().map((stat) => {
            const totalExpense = getTotalExpense();
            const percentage =
              totalExpense > 0 ? (stat.expense / totalExpense) * 100 : 0;

            return (
              <View key={stat.category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{stat.category}</Text>
                  <Text style={styles.categoryAmount}>
                    ₫{stat.expense.toLocaleString()}
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
                  {percentage.toFixed(1)}% của tổng chi tiêu
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6366f1",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  incomeText: {
    color: "#10b981",
  },
  expenseText: {
    color: "#ef4444",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  chartCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  chartScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  chartContainer: {
    height: CHART_HEIGHT,
    flexDirection: "row",
    paddingVertical: 10,
  },
  yAxisContainer: {
    width: 50,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  yAxisLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
    paddingBottom: 30,
    paddingLeft: 10,
  },
  barGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    borderRadius: 4,
    minHeight: 2,
  },
  incomeBar: {
    backgroundColor: "#10b981",
  },
  expenseBar: {
    backgroundColor: "#ef4444",
  },
  monthLabel: {
    position: "absolute",
    bottom: -25,
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
    width: BAR_WIDTH * 2 + 8,
    textAlign: "center",
  },
  monthLabelActive: {
    color: "#6366f1",
    fontWeight: "bold",
  },
  emptyChart: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  detailsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    marginTop: 8,
    paddingTop: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailLabelBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailAmountBold: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ef4444",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ef4444",
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: "#999",
  },
});
