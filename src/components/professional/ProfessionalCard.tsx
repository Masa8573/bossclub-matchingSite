import { Link } from 'react-router-dom'
import type { Profile } from '../../types'

interface ProfessionalCardProps {
  profile: Profile
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ profile }) => {
  return (
    <Link
      to={`/professionals/${profile.id}`}
      style={{
        display: 'block',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.2s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    >
      <div style={{ padding: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div style={{ flexShrink: 0 }}>
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                👤
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#111827',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {profile.full_name}
            </h3>
            {profile.title && (
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#4b5563',
                margin: '0.25rem 0 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {profile.title}
              </p>
            )}
          </div>
        </div>

        {profile.organization && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#4b5563', 
            marginBottom: '0.5rem',
            gap: '0.5rem'
          }}>
            <span style={{ flexShrink: 0 }}>🏢</span>
            <span style={{ 
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {profile.organization}
            </span>
          </div>
        )}

        {profile.bio && (
          <p style={{ 
            color: '#374151', 
            fontSize: '0.875rem',
            margin: '1rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {profile.bio}
          </p>
        )}

        <div style={{ 
          paddingTop: '1rem', 
          borderTop: '1px solid #f3f4f6' 
        }}>
          <span style={{ 
            color: '#2563eb', 
            fontSize: '0.875rem', 
            fontWeight: '500' 
          }}>
            詳細を見る →
          </span>
        </div>
      </div>
    </Link>
  )
}