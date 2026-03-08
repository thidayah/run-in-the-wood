import { formatDate, formatPrice } from "@/lib/utils"

interface PaymentConfirmationEmailProps {
  orderId: string
  eventName: string
  eventDate: string
  participantName: string
  paymentAmount: number
  paymentDate?: string
  paymentMethod?: string
  status?: 'pending' | 'paid'
}

export const PaymentConfirmationEmail = ({
  orderId,
  eventName,
  eventDate,
  participantName,
  paymentAmount,
  paymentDate,
  paymentMethod,
  status,
}: PaymentConfirmationEmailProps) => {

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <title>Payment Confirmation - Run in the Wood</title>
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
              backgroundColor: status === 'paid' ? '#1e4620' : '#4d3e2b',
              border: `1px solid ${status === 'paid' ? '#4caf50' : '#f4af7a'}`,
              color: status === 'paid' ? '#4caf50' : '#f4af7a',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              {status === 'paid' ? '✓ PAYMENT CONFIRMED' : '✓ REGISTRATION CONFIRMED'}
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
              Your payment has been successfully confirmed.
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
              Order Summary
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
            </table>
          </div>

          {/* Payment Details Card */}
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
              Payment Details
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
                }}>Payment Date</td>
                <td style={{
                  padding: '8px 0',
                  color: '#ffffff',
                  fontSize: '14px',
                  textAlign: 'right'
                }}>{formatDate(paymentDate)}</td>
              </tr>
              <tr>
                <td style={{
                  padding: '8px 0',
                  color: '#96b996',
                  fontSize: '14px'
                }}>Payment Method</td>
                <td style={{
                  padding: '8px 0',
                  color: '#ffffff',
                  fontSize: '14px',
                  textAlign: 'right',
                  textTransform: 'capitalize'
                }}>{paymentMethod}</td>
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
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}>{formatPrice(paymentAmount)}</td>
              </tr>
            </table>
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