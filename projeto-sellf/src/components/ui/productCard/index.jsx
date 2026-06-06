import styles from "./styles.module.css";

export default function ProductCard({
  image,
  title,
  price,
  location,
  date,
  sponsored = false,
  isNew = false,
  distance = null,
  isFavorited = false,
}) {
  return (
    <div className={styles.card}>
      {/* Badges superiores */}
      <div className={styles.topBadges}>
        {sponsored && <span className={`${styles.badge} ${styles.badgeSponsored}`}>Patrocinado</span>}
        {isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>Novo</span>}
      </div>

      {/* Imagem */}
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <button
          className={`${styles.fav} ${isFavorited ? styles.favActive : ""}`}
          aria-label="Favoritar"
        >
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <p className={styles.price}>R$ {price}</p>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>location_on</span>
            {location}
          </span>
          {distance !== null && (
            <span className={`${styles.metaItem} ${styles.distance}`}>
              <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>near_me</span>
              {distance} km de você
            </span>
          )}
        </div>

        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
}