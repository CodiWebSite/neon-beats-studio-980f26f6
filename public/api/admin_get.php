<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');
$dir = __DIR__ . '/data';
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
$availabilityFile = $dir . '/availability.json';
$galleryFile = $dir . '/gallery.json';
$passFile = $dir . '/admin_pass.json';
$promotionsFile = $dir . '/promotions.json';
$availability = [];
$gallery = [];
$hasPass = false;
$promotions = [];
if (file_exists($availabilityFile)) {
  $raw = file_get_contents($availabilityFile);
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) { $availability = $decoded; }
}
if (file_exists($galleryFile)) {
  $raw = file_get_contents($galleryFile);
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) { $gallery = $decoded; }
}
if (file_exists($promotionsFile)) {
  $raw = file_get_contents($promotionsFile);
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) { $promotions = $decoded; }
}
if (file_exists($passFile)) {
  $raw = file_get_contents($passFile);
  $decoded = json_decode($raw, true);
  $hasPass = is_array($decoded) && !empty($decoded['hash']);
}
echo json_encode([
  'availability' => $availability,
  'gallery' => $gallery,
  'hasPass' => $hasPass,
  'promotions' => $promotions,
]);
