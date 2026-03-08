import { formatDate, formatPrice } from "@/lib/utils"

interface RegsistrationConfirmationEmailProps {
  orderId: string
  eventName: string
  eventDate: string
  participantName: string
  paymentAmount: number
  paymentUrl?: string
  status: 'pending' | 'paid'
}

export const RegsistrationConfirmationEmail = ({
  orderId,
  eventName,
  eventDate,
  participantName,
  paymentAmount,
  paymentUrl,
  status,
}: RegsistrationConfirmationEmailProps) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <title>Registration Confirmation - Run in the Wood</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#0f1f0f',
        color: '#e5e5e5',
        margin: 0,
        padding: 0,
        lineHeight: 1.6
      }}>
        {/* Container utama */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#181b15a',
          borderRadius: '12px',
          border: '1px solid #ffff'
        }}>

          {/* Header dengan logo */}
          <div style={{
            textAlign: 'center',
            padding: '20px',
            borderBottom: '1px solid #354f35'
          }}>
            {/* Tree Icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 10px' }}>
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="#ea6c24" strokeWidth="2" fill="#ea6c24" fillOpacity="0.2" />
              <path d="M12 12V22" stroke="#ea6c24" strokeWidth="2" />
              <path d="M8 16L12 22L16 16" stroke="#ea6c24" strokeWidth="2" fill="none" />
            </svg>

            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              margin: '0',
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif'
            }}>
              Run in the <span style={{ color: '#81c914' }}>Wood</span>
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#d6d3d1',
              margin: '5px 0 0'
            }}>
              Run Wild, Find Freedom
            </p>
          </div>

          {/* Status Badge */}
          <div style={{
            textAlign: 'center',
            margin: '20px 0'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '30px',
              backgroundColor: '#ff96012b',
              border: `1px solid #ff9601`,
              color: '#ff9601',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              REGISTRATION CONFIRMED
            </div>
          </div>

          {/* Welcome Message */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '22px',
              color: '#ffffff',
              margin: '0 0 10px'
            }}>
              Hello, {participantName}!
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#d6d3d1',
              margin: '0'
            }}>
              Your registration has been successfully confirmed, and please complete your payment within 1 hour.
            </p>
          </div>

          {/* Order Details Card */}
          <div style={{
            backgroundColor: '#0f1f0f',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid #354f35'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#ffffff',
              margin: '0 0 15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #354f35'
            }}>
              Order Details
            </h3>

            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <tr>
                <td style={{
                  padding: '8px 0',
                  color: '#96b996',
                  fontSize: '14px'
                }}>Order ID</td>
                <td style={{
                  padding: '8px 0',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}>{orderId}</td>
              </tr>
              <tr>
                <td style={{
                  padding: '8px 0',
                  color: '#96b996',
                  fontSize: '14px'
                }}>Event</td>
                <td style={{
                  padding: '8px 0',
                  color: '#81c914',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}>{eventName}</td>
              </tr>
              <tr>
                <td style={{
                  padding: '8px 0',
                  color: '#96b996',
                  fontSize: '14px'
                }}>Event Date</td>
                <td style={{
                  padding: '8px 0',
                  color: '#ffffff',
                  fontSize: '14px',
                  textAlign: 'right'
                }}>{formatDate(eventDate)}</td>
              </tr>

              <tr>
                <td style={{
                  padding: '8px 0',
                  color: '#96b996',
                  fontSize: '14px'
                }}>Amount</td>
                <td style={{
                  padding: '8px 0',
                  color: '#81c914',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}>{formatPrice(paymentAmount)}</td>
              </tr>
              <tr>
                <td style={{
                  padding: '8px 0',
                  color: '#96b996',
                  fontSize: '14px'
                }}>Status</td>
                <td style={{
                  padding: '8px 0',
                  color: '#ff9601',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  textTransform: 'uppercase'
                }}>{status}</td>
              </tr>
            </table>
          </div>

          <div style={{
            textAlign: 'center',
            margin: '30px 0'
          }}>
            <a
              href={paymentUrl}
              style={{
                // display: 'inline-block',
                backgroundColor: '#81c914',
                color: 'white',
                padding: '14px 60px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600px'
              }}
            >
              Pay Now
            </a>
            <p
              style={{
                color: '#d6d3d1',
                fontSize: '12px',
                marginTop: '20px'
              }}
            >
              Or copy this link: {paymentUrl}
            </p>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            padding: '20px 0 0',
            borderTop: '1px solid #354f35'
          }}>
            <div style={{
              marginBottom: '15px'
            }}>
              <a href={process.env.NEXT_PUBLIC_APP_URL} style={{
                color: '#96b996',
                textDecoration: 'none',
                margin: '0 10px',
                fontSize: '13px'
              }}>Website</a>
              <span style={{ color: '#354f35' }}>|</span>
              <a href={process.env.NEXT_PUBLIC_CONTACT_EMAIL} style={{
                color: '#96b996',
                textDecoration: 'none',
                margin: '0 10px',
                fontSize: '13px'
              }}>Instagram</a>
              <span style={{ color: '#354f35' }}>|</span>
              <a href={process.env.NEXT_PUBLIC_CONTACT_WHATSAPP} style={{
                color: '#96b996',
                textDecoration: 'none',
                margin: '0 10px',
                fontSize: '13px'
              }}>Whatsapp</a>
            </div>

            <p style={{
              fontSize: '12px',
              color: '#5d6d5d',
              margin: '0 0 5px'
            }}>
              © {new Date().getFullYear()} Run in the Wood. All rights reserved.
            </p>
            <p style={{
              fontSize: '11px',
              color: '#5d6d5d',
              margin: '0'
            }}>
              This is an automated message, please do not reply directly.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}