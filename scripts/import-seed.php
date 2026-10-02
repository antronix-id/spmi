<?php
/**
 * ==============================================================================
 * 1-CLICK CPANEL MYSQL IMPORTER FOR SPMI UNPAL
 * ==============================================================================
 * File ini digunakan untuk mengimpor seluruh skema dan data SPMI UNPAL ke database
 * MySQL secara langsung dari server cPanel (localhost).
 *
 * CARA PAKAI:
 * 1. Upload file ini (import-seed.php) dan mysql-schema-and-seed.sql ke cPanel
 *    (misal ke folder public_html atau folder website).
 * 2. Buka di browser: https://domainanda.com/import-seed.php
 * 3. Hapus file ini setelah selesai untuk keamanan!
 * ==============================================================================
 */

header('Content-Type: text/html; charset=utf-8');

$host = 'localhost';
$user = 'unpx1994_jemiarian';
$pass = 'Spmiunpal!23.';
$db   = 'unpx1994_spmi-unpal';
$file = __DIR__ . '/mysql-schema-and-seed.sql';

echo "<h2>🚀 SPMI UNPAL - Database Seed Importer</h2>";

if (!file_exists($file)) {
    die("<p style='color:red;'>❌ Berkas SQL tidak ditemukan di: <code>$file</code><br>Pastikan file <code>mysql-schema-and-seed.sql</code> diletakkan di folder yang sama dengan script ini.</p>");
}

$mysqli = @new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_error) {
    die("<p style='color:red;'>❌ Gagal terhubung ke MySQL: (" . $mysqli->connect_errno . ") " . htmlspecialchars($mysqli->connect_error) . "</p>");
}

$mysqli->set_charset("utf8mb4");

$sql = file_get_contents($file);
echo "<p>⏳ Menjalankan skema dan insert data ke database <b>$db</b>...</p>";

if ($mysqli->multi_query($sql)) {
    do {
        if ($result = $mysqli->store_result()) {
            $result->free();
        }
    } while ($mysqli->more_results() && $mysqli->next_result());
}

if ($mysqli->error) {
    echo "<p style='color:red;'>⚠️ Peringatan/Error saat eksekusi: " . htmlspecialchars($mysqli->error) . "</p>";
} else {
    echo "<p style='color:green; font-weight:bold;'>🎉 SELURUH DATA BERHASIL DIIMPORT KE DATABASE CPANEL!</p>";
}

// Tampilkan verifikasi tabel
echo "<h3>📋 Status Tabel Database:</h3><ul>";
$res = $mysqli->query("SHOW TABLES");
if ($res) {
    while ($row = $res->fetch_array()) {
        $tbl = $row[0];
        $cntRes = $mysqli->query("SELECT COUNT(*) FROM `$tbl`");
        $cnt = $cntRes ? $cntRes->fetch_row()[0] : 0;
        echo "<li><b>$tbl</b>: $cnt baris data</li>";
    }
}
echo "</ul>";

echo "<hr><p style='color:#b91c1c;'>⚠️ <b>PENTING:</b> Hapus file <code>import-seed.php</code> ini dari File Manager cPanel Anda setelah proses ini selesai demi keamanan!</p>";
$mysqli->close();
