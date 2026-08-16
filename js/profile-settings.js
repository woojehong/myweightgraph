const PROFILE_LIMITS = Object.freeze({
  nameMax: 12,
  goalMin: 30,
  goalMax: 300,
  heightMin: 100,
  heightMax: 250,
  birthYearMin: 1930,
  minimumAge: 16,
});

const numberValue = value => {
  const normalized = String(value ?? '').trim().replace(',', '.');
  return normalized === '' ? NaN : Number(normalized);
};

export function validateProfileSettings(raw, { currentYear = new Date().getFullYear(), hasPassword = false } = {}) {
  const name = String(raw?.name ?? '').trim();
  if (!name) return { ok: false, field: 'name', message: '닉네임을 입력해 주세요.' };
  if (Array.from(name).length > PROFILE_LIMITS.nameMax) {
    return { ok: false, field: 'name', message: `닉네임은 ${PROFILE_LIMITS.nameMax}자 이내로 입력해 주세요.` };
  }

  const goal = numberValue(raw?.goal);
  if (!Number.isFinite(goal)) return { ok: false, field: 'goal', message: '목표 체중을 입력해 주세요.' };
  if (goal < PROFILE_LIMITS.goalMin || goal > PROFILE_LIMITS.goalMax) {
    return { ok: false, field: 'goal', message: `목표 체중은 ${PROFILE_LIMITS.goalMin}~${PROFILE_LIMITS.goalMax}kg 범위로 입력해 주세요.` };
  }
  if (Math.abs(goal * 10 - Math.round(goal * 10)) > 1e-7) {
    return { ok: false, field: 'goal', message: '목표 체중은 소수점 첫째 자리까지만 입력해 주세요.' };
  }

  const height = numberValue(raw?.height);
  if (!Number.isInteger(height) || height < PROFILE_LIMITS.heightMin || height > PROFILE_LIMITS.heightMax) {
    return { ok: false, field: 'height', message: `키는 ${PROFILE_LIMITS.heightMin}~${PROFILE_LIMITS.heightMax}cm의 정수로 입력해 주세요.` };
  }

  const birthYear = numberValue(raw?.birthYear);
  const latestBirthYear = currentYear - PROFILE_LIMITS.minimumAge;
  if (!Number.isInteger(birthYear) || birthYear < PROFILE_LIMITS.birthYearMin || birthYear > latestBirthYear) {
    return { ok: false, field: 'birthYear', message: `출생연도는 ${PROFILE_LIMITS.birthYearMin}~${latestBirthYear}년 범위로 입력해 주세요.` };
  }

  const password = String(raw?.password ?? '');
  const passwordConfirm = String(raw?.passwordConfirm ?? '');
  const removePassword = raw?.removePassword === true;
  let passwordAction = 'keep';
  if (removePassword && hasPassword) passwordAction = 'remove';
  else if (password || passwordConfirm) {
    if (!/^\d{4}$/.test(password)) {
      return { ok: false, field: 'password', message: '비밀번호는 숫자 4자리로 입력해 주세요.' };
    }
    if (password !== passwordConfirm) {
      return { ok: false, field: 'passwordConfirm', message: '비밀번호 확인이 일치하지 않습니다.' };
    }
    passwordAction = 'set';
  }

  return {
    ok: true,
    value: {
      name,
      goal: Math.round(goal * 10) / 10,
      height,
      birthYear,
      password,
      passwordAction,
    },
  };
}

export function isOwnProfileSettingsTarget(uid, {
  ownerUid = globalThis.localStorage?.getItem?.('uid') || '',
  search = globalThis.location?.search || '',
} = {}) {
  if (!uid || ownerUid !== uid) return false;
  return new URLSearchParams(search).get('admin_view') !== '1';
}

function modalMarkup() {
  return `
    <div class="profile-settings-backdrop" data-profile-settings-backdrop>
      <section class="profile-settings-modal" role="dialog" aria-modal="true" aria-labelledby="profileSettingsTitle">
        <div class="profile-settings-heading">
          <div>
            <h2 id="profileSettingsTitle">기본 프로필 설정</h2>
            <p>꾸미기 항목은 쇼룸에서 관리합니다.</p>
          </div>
          <button type="button" class="profile-settings-close" data-profile-settings-close aria-label="닫기">닫기</button>
        </div>
        <form data-profile-settings-form novalidate>
          <div class="profile-settings-field profile-settings-wide">
            <label for="profileSettingsName">닉네임</label>
            <input class="input-field" id="profileSettingsName" name="name" maxlength="12" autocomplete="nickname">
          </div>
          <div class="profile-settings-grid">
            <div class="profile-settings-field">
              <label for="profileSettingsGoal">목표 체중</label>
              <div class="profile-settings-unit"><input class="input-field" id="profileSettingsGoal" name="goal" type="number" inputmode="decimal" min="30" max="300" step="0.1"><span>kg</span></div>
            </div>
            <div class="profile-settings-field">
              <label for="profileSettingsHeight">키</label>
              <div class="profile-settings-unit"><input class="input-field" id="profileSettingsHeight" name="height" type="number" inputmode="numeric" min="100" max="250" step="1"><span>cm</span></div>
            </div>
          </div>
          <div class="profile-settings-field profile-settings-wide">
            <label for="profileSettingsBirthYear">출생연도</label>
            <input class="input-field" id="profileSettingsBirthYear" name="birthYear" type="number" inputmode="numeric" min="1930" step="1">
          </div>
          <div class="profile-settings-password">
            <div class="profile-settings-password-head"><strong>비밀번호</strong><span data-profile-password-status></span></div>
            <p data-profile-password-help></p>
            <div class="profile-settings-grid">
              <div class="profile-settings-field"><label for="profileSettingsPassword">새 비밀번호</label><input class="input-field" id="profileSettingsPassword" name="password" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password" placeholder="숫자 4자리"></div>
              <div class="profile-settings-field"><label for="profileSettingsPasswordConfirm">비밀번호 확인</label><input class="input-field" id="profileSettingsPasswordConfirm" name="passwordConfirm" type="password" inputmode="numeric" maxlength="4" autocomplete="new-password" placeholder="한 번 더 입력"></div>
            </div>
            <button type="button" class="profile-settings-remove" data-profile-password-remove hidden>비밀번호 제거</button>
          </div>
          <p class="profile-settings-error" data-profile-settings-error role="alert" aria-live="polite"></p>
          <div class="profile-settings-actions">
            <button type="button" class="btn btn-ghost" data-profile-settings-cancel>취소</button>
            <button type="submit" class="btn btn-primary" data-profile-settings-save>저장</button>
          </div>
        </form>
      </section>
    </div>`;
}

export function installProfileSettings({
  uid,
  getUser,
  onSaved,
  notify,
  canEdit = isOwnProfileSettingsTarget(uid),
  trigger = '[data-profile-settings-trigger]',
} = {}) {
  const triggers = [...document.querySelectorAll(trigger)];
  if (!canEdit) {
    triggers.forEach(element => {
      element.classList.add('profile-settings-disabled');
      element.setAttribute('aria-disabled', 'true');
      element.removeAttribute('role');
      element.removeAttribute('tabindex');
    });
    return { canEdit: false, open() {}, close() {}, destroy() {} };
  }

  const host = document.createElement('div');
  host.className = 'profile-settings-host';
  host.innerHTML = modalMarkup();
  document.body.append(host);

  const backdrop = host.querySelector('[data-profile-settings-backdrop]');
  const form = host.querySelector('[data-profile-settings-form]');
  const error = host.querySelector('[data-profile-settings-error]');
  const saveButton = host.querySelector('[data-profile-settings-save]');
  const removeButton = host.querySelector('[data-profile-password-remove]');
  const passwordStatus = host.querySelector('[data-profile-password-status]');
  const passwordHelp = host.querySelector('[data-profile-password-help]');
  const passwordInput = form.elements.password;
  const passwordConfirmInput = form.elements.passwordConfirm;
  let removePassword = false;
  let returnFocus = null;

  const setPasswordRemoval = enabled => {
    removePassword = enabled;
    removeButton.classList.toggle('selected', enabled);
    removeButton.setAttribute('aria-pressed', String(enabled));
    removeButton.textContent = enabled ? '비밀번호 제거 취소' : '비밀번호 제거';
    passwordInput.disabled = enabled;
    passwordConfirmInput.disabled = enabled;
    if (enabled) { passwordInput.value = ''; passwordConfirmInput.value = ''; }
  };

  const clearInvalid = () => host.querySelectorAll('[aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));
  const showError = result => {
    clearInvalid();
    error.textContent = result?.message || '';
    const field = result?.field && form.elements[result.field];
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  };

  const close = () => {
    backdrop.classList.remove('open');
    document.body.classList.remove('profile-settings-open');
    showError(null);
    returnFocus?.focus?.();
  };

  const open = event => {
    const user = getUser?.();
    if (!user) return;
    returnFocus = event?.currentTarget || document.activeElement;
    form.elements.name.value = user.name || '';
    form.elements.goal.value = user.goal ?? '';
    form.elements.height.value = user.height ?? '';
    form.elements.birthYear.value = user.birthYear ?? '';
    form.elements.birthYear.max = String(new Date().getFullYear() - PROFILE_LIMITS.minimumAge);
    passwordInput.value = '';
    passwordConfirmInput.value = '';
    const hasPassword = !!user.passwordHash;
    passwordStatus.textContent = hasPassword ? '설정됨' : '미설정';
    passwordHelp.textContent = hasPassword ? '변경할 때만 새 번호를 입력하세요.' : '원할 때만 숫자 4자리로 설정하세요.';
    removeButton.hidden = !hasPassword;
    setPasswordRemoval(false);
    showError(null);
    backdrop.classList.add('open');
    document.body.classList.add('profile-settings-open');
    requestAnimationFrame(() => form.elements.name.focus());
  };

  const save = async event => {
    event.preventDefault();
    const current = getUser?.();
    if (!current) return showError({ message: '프로필 정보를 불러오지 못했습니다.' });
    const checked = validateProfileSettings({
      name: form.elements.name.value,
      goal: form.elements.goal.value,
      height: form.elements.height.value,
      birthYear: form.elements.birthYear.value,
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
      removePassword,
    }, { hasPassword: !!current.passwordHash });
    if (!checked.ok) return showError(checked);

    clearInvalid();
    error.textContent = '';
    saveButton.disabled = true;
    saveButton.textContent = '저장 중';
    try {
      const [{ updateUser, setUserPassword }, { saveAuth, clearAuth }] = await Promise.all([
        import('./db.js'),
        import('./auth.js'),
      ]);
      const { name, goal, height, birthYear, password, passwordAction } = checked.value;
      await updateUser(uid, { name, goal, height, birthYear });
      let passwordHash = current.passwordHash || null;
      if (passwordAction === 'set') {
        passwordHash = await setUserPassword(uid, password);
        saveAuth(uid, passwordHash);
      } else if (passwordAction === 'remove') {
        passwordHash = await setUserPassword(uid, null);
        clearAuth();
      }
      const updated = { ...current, name, goal, height, birthYear, passwordHash };
      const chipName = document.getElementById('chipName');
      if (chipName) chipName.textContent = name;
      await onSaved?.(updated);
      document.dispatchEvent(new CustomEvent('profile-settings:saved', { detail: updated }));
      close();
      notify?.('기본 프로필을 저장했습니다.', 'ok');
    } catch (cause) {
      console.error('profile settings save failed', cause);
      showError({ message: cause?.message || '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = '저장';
    }
  };

  const onKeydown = event => {
    if (!backdrop.classList.contains('open')) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  };
  const onBackdrop = event => { if (event.target === backdrop) close(); };
  const bindings = triggers.map(element => {
    element.classList.remove('profile-settings-disabled');
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', '기본 프로필 설정 열기');
    const onClick = event => open(event);
    const onTriggerKey = event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(event); }
    };
    element.addEventListener('click', onClick);
    element.addEventListener('keydown', onTriggerKey);
    return [element, onClick, onTriggerKey];
  });

  removeButton.addEventListener('click', () => setPasswordRemoval(!removePassword));
  host.querySelector('[data-profile-settings-close]').addEventListener('click', close);
  host.querySelector('[data-profile-settings-cancel]').addEventListener('click', close);
  backdrop.addEventListener('click', onBackdrop);
  form.addEventListener('submit', save);
  document.addEventListener('keydown', onKeydown);

  return {
    canEdit: true,
    open,
    close,
    destroy() {
      bindings.forEach(([element, onClick, onTriggerKey]) => {
        element.removeEventListener('click', onClick);
        element.removeEventListener('keydown', onTriggerKey);
      });
      document.removeEventListener('keydown', onKeydown);
      host.remove();
    },
  };
}

