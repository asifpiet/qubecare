<script setup>
definePage({
    meta: {
        action: 'read',
        subject: 'Affiliate Dashboard View',
    },
})
</script>
<template>
    <main class="main-content">
        <!-- Stats Overview -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-injured"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">128</div>
                    <div class="stat-label">Total Patients</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> 12% from last month
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">36</div>
                    <div class="stat-label">Appointments This Week</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> 5% from last week
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">24</div>
                    <div class="stat-label">Referrals</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> 15% from last month
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">$2,500</div>
                    <div class="stat-label">Affiliate Earnings</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> 32% from last month
                    </div>
                </div>
            </div>
        </div>

        <!-- Bank Account Setup Card -->
        <div class="setup-card">
            <div class="setup-header">
                <div class="setup-title">
                    <i class="fas fa-university"></i> Banking Information
                </div>
                <div class="setup-badge">
                    <i class="fas fa-exclamation-circle"></i> Action Required
                </div>
            </div>

            <div class="setup-message">
                <i class="fas fa-info-circle"></i>
                <span>Please set up your banking information to receive affiliate payments. You need to add your banking
                    details to get paid for your referrals.</span>
            </div>

            <button class="btn-primary">
                <i class="fas fa-plus-circle"></i> Add Banking Information
            </button>
        </div>

        <!-- Recent Patients Card -->
        <div class="setup-card">
            <div class="setup-header">
                <div class="setup-title">
                    <i class="fas fa-user-injured"></i> Recent Patients
                </div>
            </div>

            <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                <thead>
                    <tr>
                        <th
                            style="text-align: left; padding: 12px 15px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">
                            Name</th>
                        <th
                            style="text-align: left; padding: 12px 15px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">
                            Last Visit</th>
                        <th
                            style="text-align: left; padding: 12px 15px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">
                            Condition</th>
                        <th
                            style="text-align: left; padding: 12px 15px; border-bottom: 1px solid rgba(0,0,0,0.05); color: #6b7280; font-size: 14px;">
                            Next Appointment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="transition: all 0.3s;">
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 40px; height: 40px; border-radius: 12px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: 600;">
                                    JD</div>
                                <div>John Doe</div>
                            </div>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Feb 28, 2025</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Lower Back Pain</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div
                                style="display: inline-block; padding: 5px 12px; background: rgba(21, 110, 77, 0.1); color: #156e4d; border-radius: 20px; font-size: 13px;">
                                Mar 7, 2025</div>
                        </td>
                    </tr>
                    <tr style="transition: all 0.3s;">
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 40px; height: 40px; border-radius: 12px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: 600;">
                                    JS</div>
                                <div>Jane Smith</div>
                            </div>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Mar 1, 2025</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Neck Stiffness</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div
                                style="display: inline-block; padding: 5px 12px; background: rgba(21, 110, 77, 0.1); color: #156e4d; border-radius: 20px; font-size: 13px;">
                                Mar 8, 2025</div>
                        </td>
                    </tr>
                    <tr style="transition: all 0.3s;">
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 40px; height: 40px; border-radius: 12px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: 600;">
                                    RJ</div>
                                <div>Robert Johnson</div>
                            </div>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Mar 2, 2025</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Shoulder Pain</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div
                                style="display: inline-block; padding: 5px 12px; background: rgba(21, 110, 77, 0.1); color: #156e4d; border-radius: 20px; font-size: 13px;">
                                Mar 9, 2025</div>
                        </td>
                    </tr>
                    <tr style="transition: all 0.3s;">
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center;">
                                <div
                                    style="width: 40px; height: 40px; border-radius: 12px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: 600;">
                                    MW</div>
                                <div>Mary Williams</div>
                            </div>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Mar 3, 2025</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">Spinal Alignment</td>
                        <td style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                            <div
                                style="display: inline-block; padding: 5px 12px; background: rgba(21, 110, 77, 0.1); color: #156e4d; border-radius: 20px; font-size: 13px;">
                                Mar 10, 2025</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style="text-align: center; margin-top: 20px;">
                <a href="#"
                    style="color: #156e4d; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center;">
                    View All Patients <i class="fas fa-arrow-right" style="margin-left: 5px; font-size: 12px;"></i>
                </a>
            </div>
        </div>

        <!-- Upcoming Appointments -->
        <div class="setup-card">
            <div class="setup-header">
                <div class="setup-title">
                    <i class="fas fa-calendar-alt"></i> Upcoming Appointments
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <!-- Today's Appointments -->
                <div
                    style="background: rgba(255, 255, 255, 0.5); border-radius: 12px; padding: 20px; border: 1px solid rgba(0,0,0,0.03);">
                    <h3
                        style="font-size: 16px; margin-bottom: 15px; color: #333333; display: flex; align-items: center;">
                        <span
                            style="display: inline-block; width: 8px; height: 8px; background: #156e4d; border-radius: 50%; margin-right: 8px;"></span>
                        Today (March 5, 2025)
                    </h3>

                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div
                                style="width: 30px; height: 30px; border-radius: 8px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">
                                ET</div>
                            <div style="font-weight: 500;">Emily Thompson</div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin-left: 40px; color: #6b7280; font-size: 13px;">
                            <i class="fas fa-clock" style="margin-right: 5px; font-size: 12px;"></i> 10:00 AM - 11:00 AM
                        </div>
                    </div>

                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div
                                style="width: 30px; height: 30px; border-radius: 8px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">
                                MD</div>
                            <div style="font-weight: 500;">Michael Davis</div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin-left: 40px; color: #6b7280; font-size: 13px;">
                            <i class="fas fa-clock" style="margin-right: 5px; font-size: 12px;"></i> 2:30 PM - 3:30 PM
                        </div>
                    </div>

                    <div>
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div
                                style="width: 30px; height: 30px; border-radius: 8px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">
                                SL</div>
                            <div style="font-weight: 500;">Sarah Lee</div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin-left: 40px; color: #6b7280; font-size: 13px;">
                            <i class="fas fa-clock" style="margin-right: 5px; font-size: 12px;"></i> 4:00 PM - 5:00 PM
                        </div>
                    </div>
                </div>

                <!-- Tomorrow's Appointments -->
                <div
                    style="background: rgba(255, 255, 255, 0.5); border-radius: 12px; padding: 20px; border: 1px solid rgba(0,0,0,0.03);">
                    <h3
                        style="font-size: 16px; margin-bottom: 15px; color: #333333; display: flex; align-items: center;">
                        <span
                            style="display: inline-block; width: 8px; height: 8px; background: #6b7280; border-radius: 50%; margin-right: 8px;"></span>
                        Tomorrow (March 6, 2025)
                    </h3>

                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div
                                style="width: 30px; height: 30px; border-radius: 8px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">
                                TB</div>
                            <div style="font-weight: 500;">Thomas Brown</div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin-left: 40px; color: #6b7280; font-size: 13px;">
                            <i class="fas fa-clock" style="margin-right: 5px; font-size: 12px;"></i> 9:00 AM - 10:00 AM
                        </div>
                    </div>

                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.03);">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div
                                style="width: 30px; height: 30px; border-radius: 8px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">
                                JM</div>
                            <div style="font-weight: 500;">Jennifer Miller</div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin-left: 40px; color: #6b7280; font-size: 13px;">
                            <i class="fas fa-clock" style="margin-right: 5px; font-size: 12px;"></i> 11:30 AM - 12:30 PM
                        </div>
                    </div>

                    <div>
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <div
                                style="width: 30px; height: 30px; border-radius: 8px; background: #1d8e63; color: white; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">
                                DW</div>
                            <div style="font-weight: 500;">David Wilson</div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin-left: 40px; color: #6b7280; font-size: 13px;">
                            <i class="fas fa-clock" style="margin-right: 5px; font-size: 12px;"></i> 3:00 PM - 4:00 PM
                        </div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <a href="#"
                    style="color: #156e4d; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center;">
                    View Full Schedule <i class="fas fa-arrow-right" style="margin-left: 5px; font-size: 12px;"></i>
                </a>
            </div>
        </div>

        <!-- Affiliate Products -->
        <div class="setup-card">
            <div class="setup-header">
                <div class="setup-title">
                    <i class="fas fa-box"></i> Affiliate Products
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
                <!-- Product 1 -->
                <div
                    style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); transition: all 0.3s;">
                    <div style="height: 150px; background: #1d8e63; position: relative; overflow: hidden;">
                        <!-- <img src="/api/placeholder/400/300" alt="Therapeutic Pillow"
                            style="width: 100%; height: 100%; object-fit: cover;"> -->
                        <div
                            style="position: absolute; top: 10px; right: 10px; background: rgba(255, 183, 77, 0.9); color: white; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 20px;">
                            20% Commission
                        </div>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="font-size: 16px; margin-bottom: 10px;">Therapeutic Cervical Pillow</h3>
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">Ergonomic design
                            for neck and back pain relief. Premium memory foam with cooling gel.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-weight: 600; font-size: 18px; color: #156e4d;">$79.99</div>
                            <button
                                style="background: #156e4d; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">Promote</button>
                        </div>
                    </div>
                </div>

                <!-- Product 2 -->
                <div
                    style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); transition: all 0.3s;">
                    <div style="height: 150px; background: #1d8e63; position: relative; overflow: hidden;">
                        <!-- <img src="/api/placeholder/400/300" alt="Massage Device"
                            style="width: 100%; height: 100%; object-fit: cover;"> -->
                        <div
                            style="position: absolute; top: 10px; right: 10px; background: rgba(255, 183, 77, 0.9); color: white; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 20px;">
                            25% Commission
                        </div>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="font-size: 16px; margin-bottom: 10px;">Deep Tissue Massage Device</h3>
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
                            Professional-grade percussion massager with 5 speed settings and 4 attachment heads.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-weight: 600; font-size: 18px; color: #156e4d;">$149.99</div>
                            <button
                                style="background: #156e4d; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">Promote</button>
                        </div>
                    </div>
                </div>

                <!-- Product 3 -->
                <div
                    style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); transition: all 0.3s;">
                    <div style="height: 150px; background: #1d8e63; position: relative; overflow: hidden;">
                        <!-- <img src="/api/placeholder/400/300" alt="Posture Corrector"
                            style="width: 100%; height: 100%; object-fit: cover;"> -->
                        <div
                            style="position: absolute; top: 10px; right: 10px; background: rgba(255, 183, 77, 0.9); color: white; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 20px;">
                            18% Commission
                        </div>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="font-size: 16px; margin-bottom: 10px;">Adjustable Posture Corrector</h3>
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">Comfortable
                            support for better posture. Discreet design that can be worn under clothing.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-weight: 600; font-size: 18px; color: #156e4d;">$34.99</div>
                            <button
                                style="background: #156e4d; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">Promote</button>
                        </div>
                    </div>
                </div>

                <!-- Product 4 -->
                <div
                    style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); transition: all 0.3s;">
                    <div style="height: 150px; background: #1d8e63; position: relative; overflow: hidden;">
                        <!-- <img src="/api/placeholder/400/300" alt="Lumbar Support"
                            style="width: 100%; height: 100%; object-fit: cover;"> -->
                        <div
                            style="position: absolute; top: 10px; right: 10px; background: rgba(255, 183, 77, 0.9); color: white; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 20px;">
                            22% Commission
                        </div>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="font-size: 16px; margin-bottom: 10px;">Premium Lumbar Support Cushion</h3>
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">Ergonomic design
                            provides optimal support for office chairs and car seats.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-weight: 600; font-size: 18px; color: #156e4d;">$49.99</div>
                            <button
                                style="background: #156e4d; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 500; cursor: pointer;">Promote</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <a href="#"
                    style="color: #156e4d; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center;">
                    View All Products <i class="fas fa-arrow-right" style="margin-left: 5px; font-size: 12px;"></i>
                </a>
            </div>
        </div>
    </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f8fafc;
    color: #333333;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(21, 110, 77, 0.05) 0%, transparent 400px),
        radial-gradient(circle at 80% 70%, rgba(21, 110, 77, 0.05) 0%, transparent 400px),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
}

.dashboard {
    display: flex;
    min-height: 100vh;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    margin-bottom: 40px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.8);
    transform-style: preserve-3d;
    perspective: 1000px;
}

.stat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 70%);
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s;
    transform: translateX(-100%);
}

.stat-card:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
}

.stat-card:hover::before {
    opacity: 1;
    transform: translateX(100%);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    font-size: 24px;
    position: relative;
    z-index: 2;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #156e4d 0%, #0e5238 100%);
    color: white;
    overflow: hidden;
}

.stat-icon::before {
    content: '';
    position: absolute;
    inset: 2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%);
    border-radius: 18px;
    z-index: 0;
}

.stat-icon i {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

.stat-info {
    flex: 1;
    position: relative;
    z-index: 2;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 5px;
    background: linear-gradient(to right, #0e5238, #156e4d);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.07));
}

.stat-label {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
}

.stat-change {
    display: flex;
    align-items: center;
    font-size: 13px;
    margin-top: 5px;
}

.stat-change.positive {
    color: #4caf50;
}

.stat-change.negative {
    color: #ff7b7b;
}

.stat-change i {
    margin-right: 4px;
    font-size: 11px;
}

/* Bank Account Setup */
.setup-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.setup-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 7px;
    background: linear-gradient(135deg, #0e5238 0%, #156e4d 100%);
}

.setup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.setup-title {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
}

.setup-title i {
    margin-right: 15px;
    color: #156e4d;
    font-size: 24px;
}

.setup-badge {
    display: inline-flex;
    align-items: center;
    padding: 8px 18px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    background-color: rgba(255, 183, 77, 0.15);
    color: #ffb74d;
    box-shadow: 0 5px 15px rgba(255, 183, 77, 0.15);
    position: relative;
    overflow: hidden;
}

.setup-badge::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 0.5s, transform 0.5s;
}

.setup-badge:hover::before {
    opacity: 1;
    transform: translateX(100%);
}

.setup-message {
    background-color: rgba(255, 183, 77, 0.08);
    border-left: 4px solid #ffb74d;
    padding: 20px 25px;
    border-radius: 12px;
    margin-bottom: 30px;
    font-size: 15px;
    color: #6b7280;
    display: flex;
    align-items: center;
    box-shadow: 0 10px 30px rgba(255, 183, 77, 0.1);
}

.setup-message i {
    font-size: 24px;
    margin-right: 15px;
    color: #ffb74d;
    filter: drop-shadow(0 2px 4px rgba(255, 183, 77, 0.3));
}

.btn-primary {
    display: block;
    padding: 18px 28px;
    background: linear-gradient(135deg, #0e5238 0%, #156e4d 100%);
    color: white;
    border: none;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-align: center;
    box-shadow: 0 15px 30px rgba(21, 110, 77, 0.3);
    position: relative;
    overflow: hidden;
}

.btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s;
    transform: translateX(-100%);
}

.btn-primary:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(21, 110, 77, 0.4);
}

.btn-primary:hover::before {
    opacity: 1;
    transform: translateX(100%);
}

.btn-primary:active {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(21, 110, 77, 0.3);
}

.btn-primary i {
    margin-right: 12px;
    position: relative;
    z-index: 2;
    font-size: 18px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}

/* Responsive Media Queries */
@media (max-width: 1200px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

@media (max-width: 992px) {
    .sidebar {
        width: 80px;
    }

    .logo-text,
    .nav-text,
    .nav-category {
        display: none;
    }

    .main-content {
        margin-left: 80px;
        width: calc(100% - 80px);
    }

    .header {
        left: 80px;
    }

    .nav-link {
        justify-content: center;
        padding: 14px 5px;
    }

    .nav-icon {
        margin-right: 0;
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .main-content {
        padding: 20px;
        padding-top: calc(60px + 20px);
    }

    .setup-card {
        padding: 25px;
    }

    .setup-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
}

@media (max-width: 576px) {
    .header {
        padding: 0 20px;
    }

    .page-title {
        font-size: 18px;
    }
}
</style>
