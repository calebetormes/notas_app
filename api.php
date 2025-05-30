<?php
header('Content-Type: application/json; charset=utf-8');
$file = __DIR__ . '/notes.json';
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}
$notes = json_decode(file_get_contents($file), true);
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'list':
        echo json_encode($notes);
        break;
    case 'get':
        $id = (int) ($_REQUEST['id'] ?? 0);
        echo json_encode($notes[$id] ?? null);
        break;
    case 'save':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id']) && $data['id'] !== '') {
            $notes[$data['id']] = ['title' => $data['title'], 'text' => $data['text']];
        } else {
            $notes[] = ['title' => $data['title'], 'text' => $data['text']];
        }
        file_put_contents($file, json_encode($notes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        break;
    case 'delete':
        $id = (int) ($_REQUEST['id'] ?? 0);
        array_splice($notes, $id, 1);
        file_put_contents($file, json_encode($notes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
