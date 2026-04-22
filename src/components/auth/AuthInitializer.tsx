'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials } from '@/store/authSlice';
import { useGetQuery } from '@/hooks/useApi';
import { apiUrls } from '@/lib/apiUrls';

export function AuthInitializer() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { getQuery } = useGetQuery();
  const initialized = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !initialized.current) {
      initialized.current = true;
      
      // Optimization: Don't re-check if we already checked in this tab session and found nothing
      // This prevents hammering the /me endpoint and generating 401 logs for guests
      if (sessionStorage.getItem('auth_checked') === 'none') return;

      // Attempt to fetch current session
      getQuery({ 
        url: apiUrls.auth.me,
        isSilent: true 
      }).then((response: any) => {
        if (response && response.user) {
          dispatch(setCredentials({ 
            user: response.user, 
            token: 'session'
          }));
          sessionStorage.setItem('auth_checked', 'active');
        } else {
          sessionStorage.setItem('auth_checked', 'none');
        }
      }).catch(() => {
        sessionStorage.setItem('auth_checked', 'none');
      });
    }
  }, [isAuthenticated, dispatch, getQuery]);

  return null;
}
