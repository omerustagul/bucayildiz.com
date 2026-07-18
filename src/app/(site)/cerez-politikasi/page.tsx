import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Çerez Politikası" };

export default function CerezPolitikasiPage() {
  return (
    <>
      <PageHero kicker="Yasal" title="Çerez Politikası" breadcrumb={[{ label: "Çerez Politikası" }]} />
      <Section>
        <Prose>
          <p style={{ padding: "14px 16px", background: "var(--amber-100)", border: "1px solid var(--amber-600)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--ink-700)" }}>
            <strong>Not:</strong> Bu metin taslaktır ve nihai hâli için hukuki danışmanlık alınmalıdır.
          </p>
          <p>
            Web sitemiz, yalnızca <strong>zorunlu (teknik) çerezler</strong> kullanır. Sitenin temel işlevlerinin
            çalışması için gerekli olan bu çerezler, ziyaretçileri tanımlamak veya izlemek için kullanılmaz.
            <strong> Analitik, reklam/pazarlama veya üçüncü taraf takip (tracker) çerezi kullanmıyoruz.</strong>
          </p>

          <h3>Kullandığımız çerezler</h3>
          <ul>
            <li>
              <strong>Oturum çerezleri</strong> (<code>by_admin_session</code>, <code>by_panel_session</code>):
              Yönetim paneline veya sporcu/veli paneline giriş yaptığınızda oturumunuzun güvenli biçimde açık
              kalmasını sağlar. Yalnızca sunucu tarafından okunur (<code>httpOnly</code>), güvenli bağlantıda iletilir
              ve yaklaşık 7 gün sonra kendiliğinden sona erer. Bu çerezler olmadan giriş gerektiren alanlar çalışmaz;
              bu nedenle KVKK kapsamında açık rıza gerektirmez.
            </li>
          </ul>

          <h3>Kullanmadıklarımız</h3>
          <ul>
            <li>Google Analytics vb. <strong>analitik/istatistik</strong> çerezleri — yok.</li>
            <li><strong>Reklam / pazarlama / yeniden hedefleme</strong> çerezleri — yok.</li>
            <li>Sosyal medya veya diğer <strong>üçüncü taraf takip</strong> çerezleri — yok. Yazı tiplerimiz kendi
              sunucumuzdan sunulur; harici bir font/CDN çağrısı yapılmaz.</li>
          </ul>

          <p>
            Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz; ancak zorunlu oturum çerezlerini
            engellerseniz giriş gerektiren panellere erişemeyebilirsiniz. Kişisel verilerinizin işlenmesine dair
            ayrıntılar için <a href="/kvkk">KVKK Aydınlatma Metni</a> ve <a href="/gizlilik">Gizlilik Politikası</a>
            sayfalarımıza bakabilirsiniz.
          </p>
        </Prose>
      </Section>
    </>
  );
}
