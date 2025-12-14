<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');
$dir = __DIR__ . '/data';
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
$availabilityFile = $dir . '/availability.json';
$galleryFile = $dir . '/gallery.json';
$passFile = $dir . '/admin_pass.json';
$promotionsFile = $dir . '/promotions.json';
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || empty($data)) {
  // fallback to form-encoded
  $data = $_POST;
}
if (!is_array($data)) { http_response_code(400); echo json_encode(['error' => 'invalid']); exit; }
$action = $data['action'] ?? '';
$password = $data['password'] ?? '';
$currentPass = null;
if (file_exists($passFile)) {
  $praw = file_get_contents($passFile);
  $pdec = json_decode($praw, true);
  if (is_array($pdec) && !empty($pdec['hash'])) { $currentPass = $pdec['hash']; }
}
if ($action === 'setup') {
  if (!$password) { http_response_code(400); echo json_encode(['error' => 'missing_password']); exit; }
  if ($currentPass) { http_response_code(400); echo json_encode(['error' => 'already_set']); exit; }
  $hash = password_hash($password, PASSWORD_BCRYPT);
  file_put_contents($passFile, json_encode(['hash' => $hash]));
  echo json_encode(['ok' => true]);
  exit;
}
if ($action === 'verify') {
  if (!$currentPass || !$password || !password_verify($password, $currentPass)) { http_response_code(401); echo json_encode(['error' => 'unauthorized']); exit; }
  echo json_encode(['ok' => true]);
  exit;
}
if ($action === 'saveAvailability') {
  if (!$currentPass || !$password || !password_verify($password, $currentPass)) { http_response_code(401); echo json_encode(['error' => 'unauthorized']); exit; }
  $availability = $data['availability'] ?? null;
  if (!is_array($availability)) { http_response_code(400); echo json_encode(['error' => 'invalid_availability']); exit; }
  $ok = @file_put_contents($availabilityFile, json_encode($availability));
  if ($ok === false) { http_response_code(500); echo json_encode(['error' => 'write_failed']); exit; }
  echo json_encode(['ok' => true]);
  exit;
}
if ($action === 'saveGallery') {
  if (!$currentPass || !$password || !password_verify($password, $currentPass)) { http_response_code(401); echo json_encode(['error' => 'unauthorized']); exit; }
  $gallery = $data['gallery'] ?? null;
  if (!is_array($gallery)) { http_response_code(400); echo json_encode(['error' => 'invalid_gallery']); exit; }
  $ok = @file_put_contents($galleryFile, json_encode($gallery));
  if ($ok === false) { http_response_code(500); echo json_encode(['error' => 'write_failed']); exit; }
  echo json_encode(['ok' => true]);
  exit;
}
if ($action === 'savePromotions') {
  if (!$currentPass || !$password || !password_verify($password, $currentPass)) { http_response_code(401); echo json_encode(['error' => 'unauthorized']); exit; }
  $promotions = $data['promotions'] ?? null;
  if (!is_array($promotions)) { http_response_code(400); echo json_encode(['error' => 'invalid_promotions']); exit; }
  $ok = @file_put_contents($promotionsFile, json_encode($promotions));
  if ($ok === false) { http_response_code(500); echo json_encode(['error' => 'write_failed']); exit; }
  echo json_encode(['ok' => true]);
  exit;
}
http_response_code(400);
echo json_encode(['error' => 'unknown_action']);
