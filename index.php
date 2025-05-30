<!-- index.php -->
<!DOCTYPE html>
<html lang="pt-BR" class="h-full dark">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- ativar modo dark via classe -->
    <script>
        tailwind.config = { darkMode: 'class' }
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
    <title>|Manifestações no CRPO-AJ</title>
</head>

<body class="h-full flex">
    <?php include 'sidebar.php'; ?>
    <div class="flex-1 flex flex-col">
        <?php include 'header.php'; ?>
        <?php include 'content.php'; ?>
    </div>
    <script src="script.js"></script>
</body>

</html>