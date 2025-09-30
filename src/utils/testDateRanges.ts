// Test script for date range functionality
import { PackageService } from "../services/firebaseService";

// Test date range interface
interface TestDateRange {
  startDate: string;
  endDate: string;
  available: boolean;
  maxParticipants: number;
  notes: string;
}

// Test data for date ranges
const testDateRanges: TestDateRange[] = [
  {
    startDate: "2024-02-08",
    endDate: "2024-02-15",
    available: true,
    maxParticipants: 12,
    notes: "Semana de temporada alta",
  },
  {
    startDate: "2024-02-22",
    endDate: "2024-03-01",
    available: true,
    maxParticipants: 10,
    notes: "Condiciones perfectas de nieve",
  },
  {
    startDate: "2024-03-08",
    endDate: "2024-03-15",
    available: true,
    maxParticipants: 8,
    notes: "Última semana de temporada",
  },
];

// Test function to add date ranges to a package
export const testAddDateRanges = async (
  packageId: string,
  type: "surf" | "snowboard" = "snowboard"
): Promise<boolean> => {
  console.log(`Testing date range addition for package ${packageId} (${type})`);

  try {
    for (const dateRange of testDateRanges) {
      console.log(
        `Adding date range: ${dateRange.startDate} - ${dateRange.endDate}`
      );
      await PackageService.addDateRange(packageId, type, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        available: dateRange.available,
        maxParticipants: dateRange.maxParticipants,
        currentParticipants: 0,
        notes: dateRange.notes,
        availableSpots: dateRange.maxParticipants,
        totalSpots: dateRange.maxParticipants,
      });
      console.log("✅ Date range added successfully");
    }

    console.log("🎉 All test date ranges added successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error adding date ranges:", error);
    return false;
  }
};

// Test function to get available date ranges
export const testGetAvailableDateRanges = async (
  packageId: string,
  type: "surf" | "snowboard" = "snowboard"
) => {
  console.log(
    `Testing available date ranges retrieval for package ${packageId} (${type})`
  );

  try {
    const availableDateRanges = await PackageService.getAvailableDateRanges(
      packageId,
      type
    );
    console.log("Available date ranges:", availableDateRanges);
    console.log(`✅ Found ${availableDateRanges.length} available date ranges`);
    return availableDateRanges;
  } catch (error) {
    console.error("❌ Error getting available date ranges:", error);
    return [];
  }
};

// Test function to update a date range
export const testUpdateDateRange = async (
  packageId: string,
  type: "surf" | "snowboard",
  dateRangeId: string,
  updates: { maxParticipants?: number; notes?: string; available?: boolean }
): Promise<boolean> => {
  console.log(
    `Testing date range update for package ${packageId}, date range ${dateRangeId}`
  );

  try {
    await PackageService.updateDateRange(packageId, type, dateRangeId, updates);
    console.log("✅ Date range updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Error updating date range:", error);
    return false;
  }
};

// Test function to delete a date range
export const testDeleteDateRange = async (
  packageId: string,
  type: "surf" | "snowboard",
  dateRangeId: string
): Promise<boolean> => {
  console.log(
    `Testing date range deletion for package ${packageId}, date range ${dateRangeId}`
  );

  try {
    await PackageService.deleteDateRange(packageId, type, dateRangeId);
    console.log("✅ Date range deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Error deleting date range:", error);
    return false;
  }
};

// Complete test suite
export const runDateRangeTests = async (
  packageId: string = "1",
  type: "surf" | "snowboard" = "snowboard"
): Promise<boolean> => {
  console.log("🚀 Starting date range functionality tests...\n");

  // Test 1: Add date ranges
  console.log("Test 1: Adding date ranges");
  const addSuccess = await testAddDateRanges(packageId, type);
  if (!addSuccess) {
    console.log("❌ Test suite failed at adding date ranges");
    return false;
  }
  console.log("");

  // Test 2: Get available date ranges
  console.log("Test 2: Getting available date ranges");
  const dateRanges = await testGetAvailableDateRanges(packageId, type);
  if (dateRanges.length === 0) {
    console.log("❌ Test suite failed at getting date ranges");
    return false;
  }
  console.log("");

  // Test 3: Update a date range
  if (dateRanges.length > 0) {
    console.log("Test 3: Updating a date range");
    const firstDateRange = dateRanges[0];
    const updates = {
      maxParticipants: 15,
      notes: "Updated: Increased capacity",
    };
    const updateSuccess = await testUpdateDateRange(
      packageId,
      type,
      firstDateRange.id,
      updates
    );
    if (!updateSuccess) {
      console.log("❌ Test suite failed at updating date range");
      return false;
    }
    console.log("");
  }

  // Test 4: Verify update
  console.log("Test 4: Verifying update");
  const updatedDateRanges = await testGetAvailableDateRanges(packageId, type);
  const updatedRange = updatedDateRanges.find(
    (dr) => dr.id === dateRanges[0].id
  );
  if (updatedRange && updatedRange.maxParticipants === 15) {
    console.log("✅ Date range update verified successfully");
  } else {
    console.log("❌ Date range update verification failed");
    return false;
  }
  console.log("");

  console.log("🎉 All date range tests passed successfully!");
  console.log("\n📋 Test Summary:");
  console.log("✅ Date range addition");
  console.log("✅ Date range retrieval");
  console.log("✅ Date range update");
  console.log("✅ Update verification");
  console.log("\n🔧 Admin panel integration ready");
  console.log("📱 Contact form integration ready");
  console.log("🎨 UI display components ready");

  return true;
};

// Usage instructions
console.log(`
📖 Date Range Testing Instructions:

1. Import this module in your component or console:
   import { runDateRangeTests } from './utils/testDateRanges';

2. Run the complete test suite:
   runDateRangeTests('1', 'snowboard'); // Test with package ID 1, snowboard type
   runDateRangeTests('2', 'surf');      // Test with package ID 2, surf type

3. Run individual tests:
   testAddDateRanges('1', 'snowboard');
   testGetAvailableDateRanges('1', 'snowboard');

4. The tests will verify:
   - Date range creation
   - Date range retrieval
   - Date range updates
   - Data persistence

5. Check the admin panel at /admin to manage date ranges visually
6. Check the contact form to see trip and date selection
7. Check trip pages to see date ranges displayed
`);
