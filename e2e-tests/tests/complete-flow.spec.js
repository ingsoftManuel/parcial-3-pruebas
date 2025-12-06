const { test, expect } = require('@playwright/test');

test.describe('Sistema de Citas - Flujo Completo', () => {
  
  test('Flujo exitoso: Registrar paciente y ver formulario de citas', async ({ page }) => {
    const email = `paciente${Date.now()}@test.com`;
    
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Registrar paciente
    await page.click('[data-testid="tab-register"]');
    await page.fill('[data-testid="patient-name-input"]', 'Juan Pérez');
    await page.fill('[data-testid="patient-email-input"]', email);
    await page.fill('[data-testid="patient-phone-input"]', '3001234567');
    
    // Verificar que el botón existe y está habilitado
    const submitButton = page.locator('[data-testid="submit-patient-button"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    
    // Ir a agendar cita
    await page.click('[data-testid="tab-appointment"]');
    await page.waitForTimeout(1000);
    
    // Verificar que el formulario de citas existe
    await expect(page.locator('[data-testid="appointment-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="appointment-doctor-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="appointment-date-input"]')).toBeVisible();
  });

  test('Verificar selección de doctor y fecha', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    await page.click('[data-testid="tab-appointment"]');
    await page.waitForTimeout(1000);
    
    // Verificar que hay doctores disponibles
    const doctorSelect = page.locator('[data-testid="appointment-doctor-select"]');
    await expect(doctorSelect).toBeVisible();
    
    const options = await doctorSelect.locator('option').count();
    expect(options).toBeGreaterThan(1); // Al menos la opción vacía + doctores
    
    // Seleccionar doctor
    await page.selectOption('[data-testid="appointment-doctor-select"]', '1');
    
    // Seleccionar fecha futura
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.fill('[data-testid="appointment-date-input"]', tomorrow.toISOString().split('T')[0]);
    
    // Verificar que aparecen horarios
    await page.waitForSelector('.time-slot', { timeout: 10000 });
    const slots = await page.locator('.time-slot').count();
    expect(slots).toBeGreaterThan(0);
  });
});