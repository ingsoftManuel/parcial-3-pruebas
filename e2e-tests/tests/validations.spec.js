const { test, expect } = require('@playwright/test');

test.describe('Validaciones de Formularios', () => {
  
  test('Formulario de registro tiene todos los campos requeridos', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="tab-register"]');
    
    // Verificar que todos los campos existen
    await expect(page.locator('[data-testid="patient-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="patient-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="patient-phone-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-patient-button"]')).toBeVisible();
  });

  test('Teléfono con menos de 10 dígitos muestra error', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    const email = `test${Date.now()}@test.com`;
    await page.click('[data-testid="tab-register"]');
    
    await page.fill('[data-testid="patient-name-input"]', 'Test User');
    await page.fill('[data-testid="patient-email-input"]', email);
    await page.fill('[data-testid="patient-phone-input"]', '123');
    await page.click('[data-testid="submit-patient-button"]');
    
    await page.waitForTimeout(1000);
    
    // Debe mostrar error
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage.first()).toBeVisible();
  });

  test('Campos vacíos muestran errores', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="tab-register"]');
    
    // Intentar enviar sin llenar nada
    await page.click('[data-testid="submit-patient-button"]');
    await page.waitForTimeout(1000);
    
    // Debe mostrar múltiples errores
    const errores = page.locator('.error-message');
    const count = await errores.count();
    expect(count).toBe(3);
  });

  test('Email con formato válido permite envío', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="tab-register"]');
    
    await page.fill('[data-testid="patient-name-input"]', 'Usuario Válido');
    await page.fill('[data-testid="patient-email-input"]', 'valido@example.com');
    await page.fill('[data-testid="patient-phone-input"]', '3001234567');
    
    // El botón debe estar habilitado
    const submitButton = page.locator('[data-testid="submit-patient-button"]');
    await expect(submitButton).toBeEnabled();
  });

  test('Formulario de citas requiere selección de doctor y fecha', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="tab-appointment"]');
    
    // Sin seleccionar horario, el botón debe estar deshabilitado
    const submitButton = page.locator('[data-testid="submit-appointment-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test('Lista de citas muestra estructura correcta', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="tab-list"]');
    await page.waitForTimeout(1000);
    
    // Verificar que la vista de citas existe
    const heading = page.locator('h2:has-text("Citas Agendadas")');
    await expect(heading).toBeVisible();
  });
});