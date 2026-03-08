import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
  TicketIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import { adminService } from '../../services/adminService';

const AnalyticsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [popularTemples, setPopularTemples] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [bookingTrends, setBookingTrends] = useState(null);
  const [rankingBy, setRankingBy] = useState('bookings'); // 'bookings' or 'revenue'
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalTemples: 0,
    totalBookings: 0,
    totalDonations: 0,
  });

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      const [statsRes, templesRes, demoRes, trendsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPopularTemples(),
        adminService.getDevoteeDemographics(),
        adminService.getBookingTrends(),
      ]);

      setDashboardStats(statsRes.data);
      setPopularTemples(templesRes.data || []);
      setDemographics(demoRes.data);
      setBookingTrends(trendsRes.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  // Sort temples based on selected ranking
  const getSortedTemples = () => {
    if (!popularTemples || popularTemples.length === 0) return [];
    
    const sorted = [...popularTemples].sort((a, b) => {
      if (rankingBy === 'revenue') {
        return b.totalRevenue - a.totalRevenue;
      } else {
        return b.bookingCount - a.bookingCount;
      }
    });
    
    return sorted;
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Do you want to download the Analytics Report as PDF?\n\n' +
      'The report will include:\n' +
      '• Summary Statistics\n' +
      '• Popular Temples Ranking\n' +
      '• Booking Trends\n' +
      '• Devotee Demographics\n\n' +
      'Click OK to proceed with download.'
    );

    if (!confirmed) {
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('DarshanEase Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Summary Statistics
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary Statistics', 14, yPosition);
      yPosition += 8;

      const summaryData = [
        ['Total Devotees', dashboardStats.totalUsers.toString()],
        ['Listed Temples', dashboardStats.totalTemples.toString()],
        ['Total Bookings', dashboardStats.totalBookings.toString()],
        ['Total Revenue', `Rs ${dashboardStats.totalDonations}`]
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [255, 107, 53] },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Popular Temples
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Top 10 Popular Temples (by ${rankingBy === 'bookings' ? 'Booking Count' : 'Revenue'})`, 14, yPosition);
      yPosition += 8;

      const templesData = getSortedTemples().map((temple, index) => [
        (index + 1).toString(),
        temple.templeName,
        temple.location,
        temple.bookingCount.toString(),
        `Rs ${temple.totalRevenue}`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Rank', 'Temple Name', 'Location', 'Bookings', 'Revenue']],
        body: templesData,
        theme: 'striped',
        headStyles: { fillColor: [255, 107, 53] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9 }
      });

      // Add new page for trends
      doc.addPage();
      yPosition = 20;

      // Booking Trends
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Trends (Last 6 Months)', 14, yPosition);
      yPosition += 8;

      if (bookingTrends?.monthlyTrends?.length > 0) {
        const trendsData = bookingTrends.monthlyTrends.map(trend => [
          `${getMonthName(trend._id.month)} ${trend._id.year}`,
          trend.bookings.toString(),
          `Rs ${trend.revenue}`
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Month', 'Bookings', 'Revenue']],
          body: trendsData,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129] },
          margin: { left: 14, right: 14 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Booking Status
      if (bookingTrends?.statusDistribution?.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Booking Status Distribution', 14, yPosition);
        yPosition += 8;

        const statusData = bookingTrends.statusDistribution.map(status => [
          status._id,
          status.count.toString()
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Status', 'Count']],
          body: statusData,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { left: 14, right: 14 }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Add new page for demographics
      doc.addPage();
      yPosition = 20;

      // Demographics
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Devotee Demographics', 14, yPosition);
      yPosition += 10;

      // Gender Distribution
      if (demographics?.genderDistribution?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Gender Distribution', 14, yPosition);
        yPosition += 6;

        const genderData = demographics.genderDistribution.map(item => [
          item._id || 'Not specified',
          item.count.toString()
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Gender', 'Count']],
          body: genderData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          margin: { left: 14, right: 14 }
        });

        yPosition = doc.lastAutoTable.finalY + 12;
      }

      // Age Distribution
      if (demographics?.ageDistribution?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Age Distribution', 14, yPosition);
        yPosition += 6;

        const ageData = demographics.ageDistribution.map(item => [
          item._id,
          item.count.toString()
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Age Group', 'Count']],
          body: ageData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          margin: { left: 14, right: 14 }
        });

        yPosition = doc.lastAutoTable.finalY + 12;
      }

      // Location Distribution
      if (demographics?.locationDistribution?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Top Locations', 14, yPosition);
        yPosition += 6;

        const locationData = demographics.locationDistribution.slice(0, 10).map(item => [
          item._id || 'Not specified',
          item.count.toString()
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [['Location', 'Count']],
          body: locationData,
          theme: 'striped',
          headStyles: { fillColor: [139, 92, 246] },
          margin: { left: 14, right: 14 }
        });
      }

      // Save PDF - this triggers browser's save dialog
      const fileName = `DarshanEase_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF report');
      console.error('PDF Generation Error:', error);
    }
  };

  // Generate Excel/CSV Report
  const generateExcelReport = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Do you want to download the Analytics Report as Excel/CSV?\n\n' +
      'The report will include:\n' +
      '• Summary Statistics\n' +
      '• Popular Temples Ranking\n' +
      '• Booking Trends\n' +
      '• Devotee Demographics\n\n' +
      'Click OK to proceed with download.'
    );

    if (!confirmed) {
      return;
    }

    try {
      // Create CSV content
      let csvContent = 'DarshanEase Analytics Report\n';
      csvContent += `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;
      
      // Summary Statistics
      csvContent += 'SUMMARY STATISTICS\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Devotees,${dashboardStats.totalUsers}\n`;
      csvContent += `Listed Temples,${dashboardStats.totalTemples}\n`;
      csvContent += `Total Bookings,${dashboardStats.totalBookings}\n`;
      csvContent += `Total Revenue,₹${dashboardStats.totalDonations}\n\n`;
      
      // Popular Temples
      csvContent += `TOP 10 POPULAR TEMPLES (by ${rankingBy === 'bookings' ? 'Booking Count' : 'Revenue'})\n`;
      csvContent += 'Rank,Temple Name,Location,Bookings,Revenue\n';
      getSortedTemples().forEach((temple, index) => {
        csvContent += `${index + 1},${temple.templeName},${temple.location},${temple.bookingCount},₹${temple.totalRevenue}\n`;
      });
      csvContent += '\n';
      
      // Booking Trends
      csvContent += 'BOOKING TRENDS (Last 6 Months)\n';
      csvContent += 'Month,Year,Bookings,Revenue\n';
      bookingTrends?.monthlyTrends?.forEach(trend => {
        csvContent += `${getMonthName(trend._id.month)},${trend._id.year},${trend.bookings},₹${trend.revenue}\n`;
      });
      csvContent += '\n';
      
      // Booking Status
      csvContent += 'BOOKING STATUS DISTRIBUTION\n';
      csvContent += 'Status,Count\n';
      bookingTrends?.statusDistribution?.forEach(status => {
        csvContent += `${status._id},${status.count}\n`;
      });
      csvContent += '\n';
      
      // Demographics
      csvContent += 'DEVOTEE DEMOGRAPHICS\n\n';
      csvContent += 'Gender Distribution\n';
      csvContent += 'Gender,Count\n';
      demographics?.genderDistribution?.forEach(item => {
        csvContent += `${item._id || 'Not specified'},${item.count}\n`;
      });
      csvContent += '\n';
      
      csvContent += 'Age Distribution\n';
      csvContent += 'Age Group,Count\n';
      demographics?.ageDistribution?.forEach(item => {
        csvContent += `${item._id},${item.count}\n`;
      });
      csvContent += '\n';
      
      csvContent += 'Top Locations\n';
      csvContent += 'Location,Count\n';
      demographics?.locationDistribution?.slice(0, 10).forEach(item => {
        csvContent += `${item._id || 'Not specified'},${item.count}\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DarshanEase_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate Excel report');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8 text-gray-700" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">
                  Comprehensive insights on darshan bookings, popular temples, and devotee demographics
                </p>
              </div>
            </div>
            
            {/* Report Generation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={generatePDFReport}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export PDF
              </button>
              <button
                onClick={generateExcelReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                >
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <ArrowTrendingUpIcon className="w-3 h-3" />
                  Active
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Devotees</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  <BuildingLibraryIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Listed Temples</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalTemples}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                >
                  <TicketIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalBookings}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' }}
                >
                  <CurrencyRupeeIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{dashboardStats.totalDonations}</p>
            </Card>
          </motion.div>
        </div>

        {/* Popular Temples & Booking Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Temples */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BuildingLibraryIcon className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Top 10 Popular Temples</h2>
              </div>
              
              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rank by:</label>
                <select
                  value={rankingBy}
                  onChange={(e) => setRankingBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="bookings">Booking Count</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
            </div>
            
            {popularTemples.length === 0 ? (
              <div className="text-center py-8">
                <BuildingLibraryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No temple data available</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getSortedTemples().map((temple, index) => (
                  <div
                    key={temple._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ 
                          background: index < 3 
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                            : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{temple.templeName}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPinIcon className="w-3 h-3" />
                          {temple.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {rankingBy === 'bookings' ? (
                        <>
                          <p className="text-lg font-bold text-gray-900">{temple.bookingCount}</p>
                          <p className="text-xs text-gray-600">bookings</p>
                          <p className="text-sm font-semibold text-green-600">₹{temple.totalRevenue}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-bold text-green-600">₹{temple.totalRevenue}</p>
                          <p className="text-xs text-gray-600">revenue</p>
                          <p className="text-sm font-semibold text-gray-900">{temple.bookingCount} bookings</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Booking Trends */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Booking Trends (Last 6 Months)</h2>
            </div>
            
            {bookingTrends?.monthlyTrends?.length === 0 ? (
              <div className="text-center py-8">
                <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No booking trend data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookingTrends?.monthlyTrends?.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getMonthName(trend._id.month)} {trend._id.year}
                      </p>
                      <p className="text-sm text-gray-600">{trend.bookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{trend.revenue}</p>
                      <p className="text-xs text-gray-600">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Booking Status Distribution */}
            {bookingTrends?.statusDistribution && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {bookingTrends.statusDistribution.map((status) => (
                    <div
                      key={status._id}
                      className="p-3 bg-gray-50 rounded-lg text-center"
                    >
                      <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                      <p className="text-xs text-gray-600 capitalize">{status._id}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Devotee Demographics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <UsersIcon className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Devotee Demographics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gender Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Gender Distribution</h3>
              {demographics?.genderDistribution?.length === 0 ? (
                <p className="text-gray-600 text-sm">No data available</p>
              ) : (
                <div className="space-y-3">
                  {demographics?.genderDistribution?.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {item._id || 'Not specified'}
                      </span>
                      <span className="text-lg font-bold text-blue-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Age Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Age Groups</h3>
              {demographics?.ageDistribution?.length === 0 ? (
                <p className="text-gray-600 text-sm">No data available</p>
              ) : (
                <div className="space-y-3">
                  {demographics?.ageDistribution?.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{item._id}</span>
                      <span className="text-lg font-bold text-green-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Distribution */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Top Locations</h3>
              {demographics?.locationDistribution?.length === 0 ? (
                <p className="text-gray-600 text-sm">No data available</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {demographics?.locationDistribution?.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {item._id || 'Not specified'}
                      </span>
                      <span className="text-lg font-bold text-purple-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Devotees</p>
                <p className="text-2xl font-bold text-blue-600">{demographics?.totalUsers || 0}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{demographics?.activeUsers || 0}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Avg Bookings/Temple</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardStats.totalTemples > 0 
                    ? Math.round(dashboardStats.totalBookings / dashboardStats.totalTemples) 
                    : 0}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Avg Revenue/Booking</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{dashboardStats.totalBookings > 0 
                    ? Math.round(dashboardStats.totalDonations / dashboardStats.totalBookings) 
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsManagement;
