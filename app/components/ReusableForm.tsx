'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { showErrorToast, showSuccessToast } from '@/app/Lib/utils/toast';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  rows?: number;
  error?: string;
}

interface ReusableFormProps<T extends FieldValues> {
  schema: ZodSchema;
  onSubmit: SubmitHandler<T>;
  fields: Record<Path<T>, FormFieldProps>;
  submitButtonText?: string;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export function ReusableForm<T extends FieldValues>({
  schema,
  onSubmit,
  fields,
  submitButtonText = 'Submit',
  isLoading = false,
  title,
  description,
}: ReusableFormProps<T>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema as any) as any,
    mode: 'onBlur',
  });

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    try {
      await onSubmit(data);
      showSuccessToast('Form submitted successfully');
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Form submission failed');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {Object.entries(fields).map(([fieldName, fieldConfig]) => {
          const config = fieldConfig as FormFieldProps;
          return (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Controller
              name={fieldName as Path<T>}
              control={control}
              render={({ field }) => {
                const errorMessage = errors[fieldName as keyof typeof errors]?.message as string | undefined;

                if (config.type === 'textarea') {
                  return (
                    <>
                      <textarea
                        {...field}
                        id={fieldName}
                        placeholder={config.placeholder}
                        rows={config.rows || 4}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                          errorMessage ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    </>
                  );
                }

                if (config.type === 'select') {
                  return (
                    <>
                      <select
                        {...field}
                        id={fieldName}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                          errorMessage ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select {config.label.toLowerCase()}</option>
                        {config.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    </>
                  );
                }

                if (config.type === 'checkbox') {
                  return (
                    <>
                      <div className="flex items-center">
                        <input
                          {...field}
                          type="checkbox"
                          id={fieldName}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          checked={field.value as boolean}
                        />
                        <label htmlFor={fieldName} className="ml-2 text-sm text-gray-700">
                          {config.label}
                        </label>
                      </div>
                      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                    </>
                  );
                }

                return (
                  <>
                    <input
                      {...field}
                      type={config.type || 'text'}
                      id={fieldName}
                      placeholder={config.placeholder}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                        errorMessage ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                  </>
                );
              }}
            />
          </div>
        );
        })}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Loading...' : submitButtonText}
        </button>
      </form>
    </div>
  );
}
