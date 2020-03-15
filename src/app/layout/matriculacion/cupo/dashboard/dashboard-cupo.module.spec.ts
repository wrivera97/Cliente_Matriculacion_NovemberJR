import { DashboardMatriculaModule } from './dashboard-cupo.module';

describe('DashboardMatriculaModule', () => {
  let dashboardModule: DashboardMatriculaModule;

  beforeEach(() => {
    dashboardModule = new DashboardMatriculaModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
