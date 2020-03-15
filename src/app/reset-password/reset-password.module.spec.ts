import { ResetPasswordModule } from './reset-password.module';

describe('ResetPasswordModule', () => {
  let accessDeniedModule: ResetPasswordModule;

  beforeEach(() => {
    accessDeniedModule = new ResetPasswordModule();
  });

  it('should create an instance', () => {
    expect(accessDeniedModule).toBeTruthy();
  });
});
