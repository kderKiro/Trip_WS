<?php
define("DB_HOST", "aws-1-eu-west-1.pooler.supabase.com");
define("DB_PORT", "5432");
define("DB_NAME", "postgres");
define("DB_USER", "postgres.hmfopukitqzankwplsjf");
define("DB_PWD", "5d!&cgfvs6!uCNU");


function connectDB()
{

  $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=require";
  try {

    
    return new pdo(
      $dsn,
      DB_USER,
      DB_PWD,
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
  } 
  
  catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }

}
connectDB();



