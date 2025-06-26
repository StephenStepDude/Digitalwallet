using Microsoft.EntityFrameworkCore;
using DigitalWalletAPI.Models;

namespace DigitalWalletAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Transaction> Transactions { get; set; }        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure relationships
            modelBuilder.Entity<PaymentMethod>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Sender)
                .WithMany()
                .HasForeignKey(t => t.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Receiver)
                .WithMany()
                .HasForeignKey(t => t.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure decimal precision for Amount
            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasColumnType("decimal(18,2)");

            // Configure decimal precision for User Balance
            modelBuilder.Entity<User>()
                .Property(u => u.Balance)
                .HasColumnType("decimal(18,2)");
                
            // Seed data for testing
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    Email = "admin@example.com",
                    PasswordHash = "$2a$11$ywMF8G/Mql0ELYDlBPPTkOQPil2KbTSpOyLs0E767JtVUyXU1.rGm", // Admin123!
                    Phone = "1234567890",
                    CreatedDate = new DateTime(2025, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                    Balance = 1000.00m  // Start with $1000 balance
                },
                new User
                {
                    UserId = 2,
                    
                    Email = "user@example.com",
                    PasswordHash = "$2a$11$mKzYJcIK1KJ8kRzKGkMc/OcEM33n.4MQ1dUQW5CkVyd50qdyba2.K", // User123!
                    Phone = "0987654321",
                    CreatedDate = new DateTime(2025, 6, 5, 0, 0, 0, DateTimeKind.Utc),
                    Balance = 500.00m  // Start with $500 balance
                }
            );
        }
    }
}
