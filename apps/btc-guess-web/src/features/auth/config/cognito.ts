import { Amplify } from "aws-amplify";

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code" as const,
      userAttributes: {
        email: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

export function configureAmplify() {
  Amplify.configure(cognitoConfig);
}
