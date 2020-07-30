import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Email from '../../../../forms/field-types/Email';
import Password from '../../../../forms/field-types/Password';
import Checkbox from '../../../../forms/field-types/Checkbox';
import Button from '../../../../elements/Button';
import ConfirmPassword from '../../../../forms/field-types/ConfirmPassword';
import { useFormFields, useFormModified } from '../../../../forms/Form/context';
import APIKey from './APIKey';

import './index.scss';

const baseClass = 'auth-fields';

const Auth = (props) => {
  const { useAPIKey, requirePassword } = props;
  const [changingPassword, setChangingPassword] = useState(requirePassword);
  const { getField } = useFormFields();
  const modified = useFormModified();

  const enableAPIKey = getField('enableAPIKey');

  useEffect(() => {
    if (!modified) {
      setChangingPassword(false);
    }
  }, [modified]);

  return (
    <div className={baseClass}>
      <Email
        required
        name="email"
        label="Email"
        autoComplete="email"
      />
      {changingPassword && (
        <div className={`${baseClass}__changing-password`}>
          <Password
            autoComplete="off"
            required
            name="password"
            label="New Password"
          />
          <ConfirmPassword />
          {!requirePassword && (
            <Button
              size="small"
              buttonStyle="secondary"
              onClick={() => setChangingPassword(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
      {(!changingPassword && !requirePassword) && (
        <Button
          size="small"
          buttonStyle="secondary"
          onClick={() => setChangingPassword(true)}
        >
          Change Password
        </Button>
      )}
      {useAPIKey && (
        <div className={`${baseClass}__api-key`}>
          <Checkbox
            label="Enable API Key"
            name="enableAPIKey"
          />
          {enableAPIKey?.value && (
            <APIKey />
          )}
        </div>
      )}
    </div>
  );
};

Auth.defaultProps = {
  useAPIKey: false,
  requirePassword: false,
};

Auth.propTypes = {
  useAPIKey: PropTypes.bool,
  requirePassword: PropTypes.bool,
};

export default Auth;