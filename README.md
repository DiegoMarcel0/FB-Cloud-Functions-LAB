# FB-Cloud-Functions-LAB
Pruebas de desarrollo de funciones en la nube de Firebase

## Pruebas de Seguridad

Se han implementado pruebas de seguridad para los middlewares y validaciones del proyecto. A continuación, se describen los pasos para ejecutarlas:

### Ejecución de Pruebas
1. Asegúrate de que las dependencias estén instaladas:
   ```bash
   npm install
   ```
2. Ejecuta las pruebas con el siguiente comando:
   ```bash
   npm test
   ```

### Cobertura de Pruebas
- **authMiddleware**: Verifica que los tokens de autenticación sean válidos y maneja errores correctamente.
- **validateInput**: Valida que los datos enviados por el cliente cumplan con los requisitos esperados.

### Ubicación de las Pruebas
Las pruebas se encuentran en la carpeta `functions/tests`:
- `authMiddleware.test.ts`: Pruebas para el middleware de autenticación.
- `validateInput.test.ts`: Pruebas para la validación de datos.

### Notas
- Asegúrate de que el entorno de Firebase esté configurado correctamente antes de ejecutar las pruebas.
- Las pruebas utilizan `jest` como framework de pruebas.
