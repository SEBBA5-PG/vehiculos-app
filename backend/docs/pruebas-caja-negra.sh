#!/bin/bash
# Pruebas de caja negra (sección 10). Uso: ./docs/pruebas-caja-negra.sh salida.txt  (API corriendo en :3000)
B=http://localhost:3000
J='Content-Type: application/json'
OUT=$1; : > $OUT
run(){ # caso esperado metodo url body
  local caso=$1 exp=$2 m=$3 u=$4 body=$5
  if [ -n "$body" ]; then r=$(curl -s -w '\n%{http_code}' -X $m "$B$u" -H "$J" -d "$body"); else r=$(curl -s -w '\n%{http_code}' -X $m "$B$u"); fi
  code=$(echo "$r" | tail -1); resp=$(echo "$r" | sed '$d' | tr -d '\n' | cut -c1-160)
  st=FAIL; [ "$code" = "$exp" ] && st=PASS
  printf '%s|%s|%s %s|%s|%s|%s|%s\n' "$caso" "$exp" "$m" "$u" "$code" "$st" "$resp" "$body" >> $OUT
  LAST="$resp"
}
run TC-VEH-01 201 POST /vehiculos '{"placa":"ABC123","marca":"Toyota","modelo":"Corolla","anio":2024,"color":"Blanco"}'
ID=$(echo "$LAST" | sed -E 's/.*"id":"([0-9]+)".*/\1/')
run TC-VEH-02 400 POST /vehiculos '{}'
run TC-VEH-03 409 POST /vehiculos '{"placa":"ABC123","marca":"Mazda","modelo":"3","anio":2025,"color":"Rojo"}'
run TC-VEH-04 400 POST /vehiculos '{"placa":"XYZ987","marca":"Renault","modelo":"Logan","anio":2023,"color":"Gris","propietario":"campo-no-permitido"}'
run TC-VEH-05 200 GET /vehiculos
run TC-VEH-06 200 GET /vehiculos/$ID
run TC-VEH-07 404 GET /vehiculos/999999999
run TC-VEH-08 400 GET /vehiculos/abc
run TC-VEH-09 200 PATCH /vehiculos/$ID '{"color":"Negro"}'
run TC-VEH-09b 200 GET /vehiculos/$ID
run TC-VEH-10 400 POST /vehiculos '{"placa":"LIM1949","marca":"Ford","modelo":"T","anio":1949}'
run BV-1950 201 POST /vehiculos '{"placa":"LIM1950","marca":"Ford","modelo":"T","anio":1950}'
run BV-1951 201 POST /vehiculos '{"placa":"LIM1951","marca":"Ford","modelo":"T","anio":1951}'
run BV-2099 201 POST /vehiculos '{"placa":"LIM2099","marca":"Ford","modelo":"T","anio":2099}'
run BV-2100 201 POST /vehiculos '{"placa":"LIM2100","marca":"Ford","modelo":"T","anio":2100}'
run BV-2101 400 POST /vehiculos '{"placa":"LIM2101","marca":"Ford","modelo":"T","anio":2101}'
run TC-VEH-11 204 DELETE /vehiculos/$ID
run TC-VEH-12 404 DELETE /vehiculos/$ID
