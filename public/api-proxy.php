<?php
declare(strict_types=1);

/**
 * Same-origin API proxy for Hostinger shared hosting.
 * Browser calls /api/* on investoreducation.ahwuae.com (no CORS).
 * This script forwards server-side to the Node API subdomain.
 */
const BACKEND_API_BASE = 'https://apiinvestoredu.ahwuae.com/api';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = isset($_GET['__path']) ? ltrim((string) $_GET['__path'], '/') : '';
$queryParams = $_GET;
unset($queryParams['__path']);
$query = http_build_query($queryParams);

$url = rtrim(BACKEND_API_BASE, '/');
if ($path !== '') {
    $url .= '/' . $path;
}
if ($query !== '') {
    $url .= '?' . $query;
}

$forwardHeaders = ['Accept: application/json'];
$contentType = $_SERVER['HTTP_CONTENT_TYPE'] ?? $_SERVER['CONTENT_TYPE'] ?? null;
if ($contentType) {
    $forwardHeaders[] = 'Content-Type: ' . $contentType;
}
if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $forwardHeaders[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

$body = in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)
    ? file_get_contents('php://input')
    : null;

if (!function_exists('curl_init')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'API proxy requires PHP cURL extension']);
    exit;
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_HTTPHEADER => $forwardHeaders,
    CURLOPT_USERAGENT => 'UASA-InvestorEducation-API-Proxy/1.0',
]);
if ($body !== null && $body !== '') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'API proxy error', 'error' => curl_error($ch)]);
    curl_close($ch);
    exit;
}

$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

http_response_code($status);

foreach (explode("\r\n", $responseHeaders) as $line) {
    if ($line === '' || stripos($line, 'HTTP/') === 0) {
        continue;
    }
    if (stripos($line, 'Transfer-Encoding:') === 0) {
        continue;
    }
    if (stripos($line, 'Access-Control-') === 0) {
        continue;
    }
    header($line, false);
}

echo $responseBody;
