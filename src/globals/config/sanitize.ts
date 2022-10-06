import merge from 'deepmerge';
import { toWords } from '../../utilities/formatLabels';
import sanitizeFields from '../../fields/config/sanitize';
import { SanitizedGlobalConfig } from './types';
import { Config } from '../../config/types';
import defaultAccess from '../../auth/defaultAccess';
import baseVersionFields from '../../versions/baseFields';
import mergeBaseFields from '../../fields/mergeBaseFields';
import { versionGlobalDefaults } from '../../versions/defaults';

const sanitizeGlobals = (config: Config): SanitizedGlobalConfig[] => {
  return config.globals.map((global) => {
    const sanitizedGlobal = { ...global };

    sanitizedGlobal.label = sanitizedGlobal.label || toWords(sanitizedGlobal.slug);

    // /////////////////////////////////
    // Ensure that collection has required object structure
    // /////////////////////////////////

    if (!sanitizedGlobal.hooks) sanitizedGlobal.hooks = {};
    if (!sanitizedGlobal.endpoints) sanitizedGlobal.endpoints = [];
    if (!sanitizedGlobal.access) sanitizedGlobal.access = {};
    if (!sanitizedGlobal.admin) sanitizedGlobal.admin = {};

    if (!sanitizedGlobal.access.read) sanitizedGlobal.access.read = defaultAccess;
    if (!sanitizedGlobal.access.update) sanitizedGlobal.access.update = defaultAccess;

    if (!sanitizedGlobal.hooks.beforeValidate) sanitizedGlobal.hooks.beforeValidate = [];
    if (!sanitizedGlobal.hooks.beforeChange) sanitizedGlobal.hooks.beforeChange = [];
    if (!sanitizedGlobal.hooks.afterChange) sanitizedGlobal.hooks.afterChange = [];
    if (!sanitizedGlobal.hooks.beforeRead) sanitizedGlobal.hooks.beforeRead = [];
    if (!sanitizedGlobal.hooks.afterRead) sanitizedGlobal.hooks.afterRead = [];

    if (sanitizedGlobal.versions) {
      if (sanitizedGlobal.versions === true) sanitizedGlobal.versions = { drafts: false };

      if (sanitizedGlobal.versions.drafts) {
        if (sanitizedGlobal.versions.drafts === true) {
          sanitizedGlobal.versions.drafts = {
            autosave: false,
          };
        }

        if (sanitizedGlobal.versions.drafts.autosave === true) sanitizedGlobal.versions.drafts.autosave = {};

        sanitizedGlobal.fields = mergeBaseFields(sanitizedGlobal.fields, baseVersionFields);
      }

      sanitizedGlobal.versions = merge(versionGlobalDefaults, sanitizedGlobal.versions);
    }

    // /////////////////////////////////
    // Sanitize fields
    // /////////////////////////////////

    sanitizedGlobal.fields = sanitizeFields(sanitizedGlobal.fields, config, sanitizedGlobal);

    return sanitizedGlobal as SanitizedGlobalConfig;
  });
};

export default sanitizeGlobals;
