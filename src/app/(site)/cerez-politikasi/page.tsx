import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Section, Prose } from "@/components/content/blocks";

export const metadata: Metadata = { title: "Çerez Politikası" };

/** Çerez Politikası — KVKK uyumlu, siteyle BİREBİR doğru (yalnız zorunlu oturum
 *  çerezleri; analitik/pazarlama/tracker yok). Metin gerçek çerez envanterini yansıtır;
 *  çerez uygulaması değişirse (ör. analitik eklenirse) bu metin de güncellenmelidir. */
export default function CerezPolitikasiPage() {
  const cookieRow = { display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,2fr)", gap: 4, padding: "12px 0", borderBottom: "1px solid var(--border-subtle)" } as const;
  return (
    <>
      <PageHero kicker="Yasal" title="Çerez Politikası" breadcrumb={[{ label: "Çerez Politikası" }]} />
      <Section>
        <Prose>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Son güncelleme: 18 Temmuz 2026</p>

          <p>
            Bu Çerez Politikası, Buca Yıldız Futbol Akademisi (&ldquo;Kulüp&rdquo;, &ldquo;biz&rdquo;) tarafından işletilen{" "}
            <strong>bucayildiz.com</strong> internet sitesinde çerezlerin nasıl ve hangi amaçlarla kullanıldığını
            açıklar. Politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) ve ilgili mevzuat
            çerçevesinde hazırlanmıştır. Sitemizi kullanmaya devam ederek bu politikada açıklanan çerez uygulamalarını
            kabul etmiş sayılırsınız.
          </p>

          <h3>Çerez nedir?</h3>
          <p>
            Çerezler (cookies), bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza
            (bilgisayar, telefon veya tablet) kaydedilen küçük metin dosyalarıdır. Çerezler; oturumunuzun
            sürdürülmesi, tercihlerinizin hatırlanması ve sitenin güvenli biçimde çalışması gibi amaçlarla yaygın
            olarak kullanılır.
          </p>

          <h3>Hangi çerezleri kullanıyoruz?</h3>
          <p>
            Sitemiz <strong>yalnızca zorunlu (teknik) çerezler</strong> kullanır. Bu çerezler; giriş yaptığınız
            yönetim paneli ile sporcu/veli panelinde oturumunuzun güvenli biçimde açık kalmasını sağlar. Ziyaretçileri
            tanımlamak, profillemek veya çevrim içi hareketlerini izlemek amacıyla çerez <strong>kullanmıyoruz</strong>.
          </p>
          <div style={{ margin: "8px 0 4px" }}>
            <div style={{ ...cookieRow, fontWeight: 700, color: "var(--text-strong)", borderBottom: "2px solid var(--border-strong, var(--border-subtle))" }}>
              <span>Çerez</span><span>Amaç / nitelik</span>
            </div>
            <div style={cookieRow}>
              <span><code>by_admin_session</code></span>
              <span>Yönetim paneli oturumu. Zorunlu · birinci taraf · yalnızca sunucu tarafından okunur (httpOnly) · güvenli bağlantı (Secure) · yaklaşık 7 gün.</span>
            </div>
            <div style={cookieRow}>
              <span><code>by_panel_session</code></span>
              <span>Sporcu/veli paneli oturumu. Zorunlu · birinci taraf · yalnızca sunucu tarafından okunur (httpOnly) · güvenli bağlantı (Secure) · yaklaşık 7 gün.</span>
            </div>
          </div>
          <p>
            Bu çerezler tarayıcı sekmeleri arasında paylaşılmaz (SameSite), sürelerinin sonunda veya oturumu
            kapattığınızda geçersiz hâle gelir.
          </p>

          <h3>Kullanmadığımız çerezler</h3>
          <p>Şeffaflık ilkesi gereği, aşağıdaki çerez türlerini <strong>kullanmadığımızı</strong> açıkça beyan ederiz:</p>
          <ul>
            <li><strong>Analitik / performans çerezleri</strong> (ör. Google Analytics) — kullanılmaz.</li>
            <li><strong>Reklam, pazarlama veya yeniden hedefleme çerezleri</strong> — kullanılmaz.</li>
            <li><strong>Sosyal medya ve diğer üçüncü taraf takip çerezleri</strong> — kullanılmaz.</li>
          </ul>
          <p>
            Sitemizde kullanılan yazı tipleri kendi sunucumuzdan sunulur; harici bir yazı tipi sağlayıcısına veya
            içerik dağıtım ağına (CDN) çağrı yapılmaz.
          </p>

          <h3>Çerezlerin hukuki dayanağı</h3>
          <p>
            Kullandığımız çerezler, talep ettiğiniz hizmetin (panele giriş ve oturumun sürdürülmesi) sunulabilmesi
            için <strong>kesinlikle gereklidir</strong>. KVKK ve ilgili düzenlemeler kapsamında, hizmetin yürütülmesi
            için zorunlu olan bu nitelikteki teknik çerezlerin kullanımı <strong>ayrıca açık rıza gerektirmez</strong>;
            işleme faaliyeti, bir sözleşmenin kurulması/ifası ve veri sorumlusunun meşru menfaati hukuki sebeplerine
            dayanır (KVKK md.5/2). Zorunlu olmayan (analitik, pazarlama vb.) çerezler kullanılmadığından, bu tür
            çerezler için ayrıca rıza alınmasına gerek bulunmamaktadır.
          </p>

          <h3>Çerezleri nasıl yönetebilirsiniz?</h3>
          <p>
            Tarayıcınızın ayarlarından çerezleri görüntüleyebilir, silebilir veya engelleyebilirsiniz. Ancak zorunlu
            oturum çerezlerini engellemeniz hâlinde, giriş gerektiren panellere erişemeyebilir ve sitenin bazı
            bölümleri düzgün çalışmayabilir. Kullandığınız tarayıcının (Chrome, Safari, Firefox, Edge vb.) yardım
            sayfalarından çerez yönetimine dair ayrıntılı bilgi edinebilirsiniz.
          </p>

          <h3>Politikadaki değişiklikler</h3>
          <p>
            Bu politikayı, mevzuattaki gelişmelere veya çerez uygulamalarımızdaki değişikliklere bağlı olarak
            güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yayımlanır; yapılan güncellemeleri sayfanın başındaki
            &ldquo;son güncelleme&rdquo; tarihinden takip edebilirsiniz.
          </p>

          <h3>İlgili metinler ve iletişim</h3>
          <p>
            Kişisel verilerinizin işlenmesine ilişkin ayrıntılar için <a href="/kvkk">KVKK Aydınlatma Metni</a> ve{" "}
            <a href="/gizlilik">Gizlilik Politikası</a> sayfalarımızı inceleyebilirsiniz. Çerez uygulamalarımıza dair
            sorularınız için <a href="/iletisim">iletişim</a> sayfamız üzerinden bize ulaşabilirsiniz.
          </p>
        </Prose>
      </Section>
    </>
  );
}
