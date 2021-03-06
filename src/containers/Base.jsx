import React from 'react';

import { CSSTransition } from 'react-transition-group';

import App from './App';
import Bad from './Bad';

import ConfigProvider from '../components/common/ConfigProvider';

import Offline from '../components/common/Offline';
import CodeError from '../components/error/CodeError';
import CommonError from '../components/error/CommonError';

import sendError from '../utils/error';
import { initView } from '../utils/view';
import { interpretResponse } from '../utils/data';

import { useState, useEffect, useMount, useCompute } from '../hooks/base';
import { useBridge, useBus } from '../hooks/util';
import { useModal, useClearOverlay } from '../hooks/overlay';
import { useStorage, useStore } from '../hooks/store';
import { useFetch } from '../hooks/fetch';
import { usePlatform, ANDROID } from '@vkontakte/vkui';

import Game from '../modules/game';

const Base = () => {
  const bridge = useBridge();
  const modal = useModal();
  const bus = useBus();
  const storage = useStorage();
  const store = useStore();
  const fetch = useFetch();
  const platform = usePlatform();

  const clearOverlay = useClearOverlay();

  const [loaded, updateLoadState] = useState(false);
  const [ready, updateReadyState] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useMount(() => {
    const handleOnlineStatus = () => {
      window.requestAnimationFrame(() => {
        setShowOffline(!window.navigator.onLine);
      });
    };

    handleOnlineStatus();
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    bridge.subscribe((event) => {
      if (!event || !event.detail) {
        return;
      }

      switch (event.detail.type) {
        case 'VKWebAppViewRestore':
        case 'VKWebAppLocationChanged':
        case 'VKWebAppSetLocationResult':
        case 'VKWebAppSetViewSettingsResult':
          handleOnlineStatus();
          break;
      }
    });

    const handleError = (error, source, lineno, colno, raw) => {
      let errorModal = null;

      const send = () => {
        return sendError(error, raw, source).then((send) => {
          switch (send.type) {
            case 'bridge':
            case 'network':
              return false;
            case 'code':
              errorModal = (
                <CodeError />
              );
              return true;
            default:
              errorModal = (
                <CommonError />
              );
              return true;
          }
        }).catch((e) => {
          console.error(e);
          return false;
        });
      };

      const prepare = () => {
        return new Promise((resolve) => {
          clearOverlay((after) => {
            if (after === 'modal' || after === 'popout') {
              resolve();
            } else {
              window.requestAnimationFrame(() => {
                window.setTimeout(() => {
                  window.requestAnimationFrame(() => {
                    resolve();
                  });
                }, 1200);
              });
            }
          });
        });
      };

      send().then((result) => {
        if (result) {
          return prepare().then(() => {
            modal.show(() => errorModal);
          });
        }
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('abort', handleError);
    window.addEventListener('unhandledrejection', handleError);
    bus.on('app:error', handleError);
  });

  useMount(() => {
    const fetchUser = () => {
      return fetch.get('/vkma/me').then((response) => {
        const user = interpretResponse(response);
        user.created = response.status === 200;

        store.user = {
          ...store.user,
          ...user
        };
        bus.emit('app:auth');
      });
    };

    bus.on('app:update', fetchUser);

    const windowLoad = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        // event
        window.onload = resolve;

        // fallback
        window.setTimeout(resolve, 1E4); // 10s
      }
    });

    const fontLoad = 'fonts' in document &&
      new Promise((resolve) => {
        if (document.fonts.status === 'loaded') {
          resolve();
        } else {
        // event
          document.fonts.onloadingdone = resolve;
          document.fonts.onloadingerror = resolve;

          // promise
          let { ready } = document.fonts;
          if (typeof ready === 'function') {
            ready = ready(); // vendor/old specific
          }
          Promise.resolve(ready).then(() => {
            const { status = 'error' } = document.fonts;
            if (status === 'loaded' || status === 'error') {
              resolve();
            } else {
              window.setTimeout(resolve, 1E3); // 1s
            }
          });

          // fallback
          window.setTimeout(resolve, 1E4);  // 10s
        }
      });

    const storageLoad = storage.get().then((loaded) => {
      store.persist = {
        ...store.persist,
        ...loaded.persist
      };
    });

    Promise.all([
      fetchUser(),
      storageLoad,
      fontLoad,
      windowLoad
    ]).then(() => {
      updateLoadState(true);
    });
  });

  useEffect(() => {
    if (loaded) {
      window.requestAnimationFrame(() => {
        // app seems ready
        initView().then(() => {
          window.requestAnimationFrame(() => {
            updateReadyState(true);
          });
        });
      });
    }
  }, [loaded]);

  const Component = useCompute(() => {
    return Game.util.supports.data ? App : Bad;
  });

  return (
    <React.StrictMode>
      <ConfigProvider>
        <CSSTransition
          in={ready}
          appear={true}
          mountOnEnter={true}
          classNames="Root--fade"
          timeout={platform === ANDROID ? 300 : 600}
        >
          {
            loaded ? (
              <Component />
            ): (
              <div className="Root Root--fade-init" />
            )
          }
        </CSSTransition>
        <Offline visible={showOffline} />
      </ConfigProvider>
    </React.StrictMode>
  );
};

export default Base;
