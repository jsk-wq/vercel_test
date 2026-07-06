interface HeaderProps {
  lastUpdated: Date | null
  loading: boolean
  onRefresh: () => void
}

function formatTime(date: Date): string {
  return date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Header({ lastUpdated, loading, onRefresh }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__content">
        <div>
          <p className="header__eyebrow">Academic Calendar</p>
          <h1 className="header__title">2026 학사일정</h1>
          <p className="header__subtitle">
            Google Sheets 연동 · 5분마다 자동 갱신
          </p>
        </div>
        <div className="header__actions">
          {lastUpdated && (
            <p className="header__updated">마지막 갱신: {formatTime(lastUpdated)}</p>
          )}
          <button
            type="button"
            className="refresh-button"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? '불러오는 중…' : '새로고침'}
          </button>
        </div>
      </div>
    </header>
  )
}
